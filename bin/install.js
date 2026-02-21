#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

// Colors
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const dim = '\x1b[2m';
const reset = '\x1b[0m';

// Get version from package.json
const pkg = require('../package.json');
const atlasManifest = require('../commands/atlas/manifest.json');

const ATLAS_COMMANDS = Array.isArray(atlasManifest.commands) ? atlasManifest.commands : [];
if (ATLAS_COMMANDS.length === 0) {
  console.error('Atlas manifest has no commands. Check commands/atlas/manifest.json');
  process.exit(1);
}

const commandNameWidth = Math.max(...ATLAS_COMMANDS.map((command) => command.name.length));
const commandListText = ATLAS_COMMANDS
  .map((command) => `    /atlas:${command.name.padEnd(commandNameWidth)}  ${command.summary}`)
  .join('\n');

const banner = `
${cyan}   █████╗ ████████╗██╗      █████╗ ███████╗
  ██╔══██╗╚══██╔══╝██║     ██╔══██╗██╔════╝
  ███████║   ██║   ██║     ███████║███████╗
  ██╔══██║   ██║   ██║     ██╔══██║╚════██║
  ██║  ██║   ██║   ███████╗██║  ██║███████║
  ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝${reset}

  Claude Atlas ${dim}v${pkg.version}${reset}
  Minimal workflow for Claude Code
  ${ATLAS_COMMANDS.length} commands. Fresh context. Quality execution.
`;

// Parse args
const args = process.argv.slice(2);
const hasGlobal = args.includes('--global') || args.includes('-g');
const hasLocal = args.includes('--local') || args.includes('-l');
const hasHelp = args.includes('--help') || args.includes('-h');
const hasCodexGlobal = args.includes('--with-codex-global');

console.log(banner);

// Show help if requested
if (hasHelp) {
  console.log(`  ${yellow}Usage:${reset} npx claude-atlas [options]

  ${yellow}Options:${reset}
    ${cyan}-g, --global${reset}    Install globally (to ~/.claude)
    ${cyan}-l, --local${reset}     Install locally (to ./.claude + Codex wrappers)
    ${cyan}--with-codex-global${reset}  With --global, also install Atlas Codex skills in ~/.codex/skills
    ${cyan}-h, --help${reset}      Show this help message

  ${yellow}Examples:${reset}
    ${dim}# Install globally${reset}
    npx claude-atlas --global

    ${dim}# Install globally + global Codex skills${reset}
    npx claude-atlas --global --with-codex-global

    ${dim}# Install to current project only${reset}
    npx claude-atlas --local
`);
  process.exit(0);
}

/**
 * Copy directory recursively
 */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function renderSkillBody(command, commandDocPath) {
  return `---
name: atlas-${command.name}
description: ${command.skillDescription}
---

Read the canonical ${command.name} command markdown at \`${commandDocPath}\` and follow it exactly.

Codex command style:
- Replace any \`/atlas:<command>\` references from canonical docs with \`$atlas:<command>\` in Codex responses.

Safety: ${command.safety}
`;
}

/**
 * Render and install Codex wrappers for Atlas commands.
 * Local install only: wrappers are project-scoped and depend on ./.claude/commands.
 */
function installCodexWrappers(projectRoot) {
  const skillsRoot = path.join(projectRoot, '.agents', 'skills');
  const scriptsRoot = path.join(projectRoot, 'scripts');
  const codexConfigPath = path.join(projectRoot, '.codex', 'config.toml');
  fs.mkdirSync(skillsRoot, { recursive: true });
  fs.mkdirSync(scriptsRoot, { recursive: true });

  for (const command of ATLAS_COMMANDS) {
    const skillDir = path.join(skillsRoot, `atlas-${command.name}`);
    const skillPath = path.join(skillDir, 'SKILL.md');
    const scriptPath = path.join(scriptsRoot, `atlas-${command.name}`);
    const commandDocPath = `.claude/commands/atlas/${command.name}.md`;

    fs.mkdirSync(skillDir, { recursive: true });
    const skillBody = renderSkillBody(command, commandDocPath);
    fs.writeFileSync(skillPath, skillBody);

    const scriptBody = `#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "\${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

# Optional env overrides:
# - ATLAS_PROFILE=atlas-${command.name}
# - ATLAS_JSON=1
# - ATLAS_OUTPUT_LAST_MESSAGE=/tmp/last.txt
# - ATLAS_OUTPUT_SCHEMA=./schema.json
ATLAS_PROFILE="\${ATLAS_PROFILE:-atlas-${command.name}}"
PROMPT=${JSON.stringify(command.prompt)}

CODEX_ARGS=(exec --ephemeral --profile "$ATLAS_PROFILE")
${command.fullAuto ? 'CODEX_ARGS+=(--full-auto)\n' : ''}if [[ "\${ATLAS_JSON:-0}" == "1" ]]; then
  CODEX_ARGS+=(--json)
fi
if [[ -n "\${ATLAS_OUTPUT_LAST_MESSAGE:-}" ]]; then
  CODEX_ARGS+=(--output-last-message "$ATLAS_OUTPUT_LAST_MESSAGE")
fi
if [[ -n "\${ATLAS_OUTPUT_SCHEMA:-}" ]]; then
  CODEX_ARGS+=(--output-schema "$ATLAS_OUTPUT_SCHEMA")
fi

codex "\${CODEX_ARGS[@]}" "$PROMPT"
`;
    fs.writeFileSync(scriptPath, scriptBody);
    fs.chmodSync(scriptPath, 0o755);
  }

  const codexProfileLines = [
    '# Project-scoped Codex profiles for Atlas wrappers.',
    '# CLI flags override profiles; profiles override global user config.',
    ''
  ];
  for (const command of ATLAS_COMMANDS) {
    const isReadOnly = command.name === 'status' || command.name === 'sync';
    const reasoning = command.name === 'execute' ? 'high' : 'medium';
    codexProfileLines.push(`[profiles.atlas-${command.name}]`);
    codexProfileLines.push('approval_policy = "on-request"');
    codexProfileLines.push(`sandbox_mode = "${isReadOnly ? 'read-only' : 'workspace-write'}"`);
    codexProfileLines.push(`model_reasoning_effort = "${reasoning}"`);
    codexProfileLines.push('web_search = "cached"');
    codexProfileLines.push('');
  }
  fs.mkdirSync(path.dirname(codexConfigPath), { recursive: true });
  fs.writeFileSync(codexConfigPath, `${codexProfileLines.join('\n')}\n`);

  console.log(`  ${green}✓${reset} Installed Codex wrappers (.agents/skills + scripts + .codex/config.toml)`);
}

/**
 * Install global Codex skills under ~/.codex/skills/atlas-*.
 * These are available across repos and can be overridden by project-local skills.
 */
function installGlobalCodexSkills() {
  const codexSkillsRoot = path.join(os.homedir(), '.codex', 'skills');
  const globalCommandRoot = path.join(os.homedir(), '.claude', 'commands', 'atlas');
  fs.mkdirSync(codexSkillsRoot, { recursive: true });

  for (const command of ATLAS_COMMANDS) {
    const skillDir = path.join(codexSkillsRoot, `atlas-${command.name}`);
    const skillPath = path.join(skillDir, 'SKILL.md');
    const commandDocPath = path.join(globalCommandRoot, `${command.name}.md`);

    if (fs.existsSync(skillDir)) {
      fs.rmSync(skillDir, { recursive: true });
    }

    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(skillPath, renderSkillBody(command, commandDocPath));
  }

  console.log(`  ${green}✓${reset} Installed global Codex skills (~/.codex/skills/atlas-*)`);
}

/**
 * Install to the specified directory
 */
function install(isGlobal, options = {}) {
  const { withCodexGlobal = false } = options;
  const src = path.join(__dirname, '..');
  const claudeDir = isGlobal
    ? path.join(os.homedir(), '.claude')
    : path.join(process.cwd(), '.claude');

  const locationLabel = isGlobal
    ? '~/.claude'
    : './.claude';

  console.log(`  Installing to ${cyan}${locationLabel}${reset}\n`);

  // Create commands directory
  const commandsDir = path.join(claudeDir, 'commands');
  fs.mkdirSync(commandsDir, { recursive: true });

  // Copy commands/atlas
  const atlasSrc = path.join(src, 'commands', 'atlas');
  const atlasDest = path.join(commandsDir, 'atlas');

  // Remove existing if present
  if (fs.existsSync(atlasDest)) {
    fs.rmSync(atlasDest, { recursive: true });
  }

  copyDir(atlasSrc, atlasDest);
  console.log(`  ${green}✓${reset} Installed commands/atlas`);

  // Copy templates
  const templatesSrc = path.join(src, 'templates');
  const templatesDest = path.join(claudeDir, 'atlas-templates');

  // Remove existing if present
  if (fs.existsSync(templatesDest)) {
    fs.rmSync(templatesDest, { recursive: true });
  }

  copyDir(templatesSrc, templatesDest);
  console.log(`  ${green}✓${reset} Installed atlas-templates`);

  // Copy skills
  const skillsSrc = path.join(src, 'skills');
  const skillsDest = path.join(claudeDir, 'skills');

  // Only install skills if they exist in the source
  if (fs.existsSync(skillsSrc)) {
    // Create skills directory
    fs.mkdirSync(skillsDest, { recursive: true });

    // Copy each skill, preserving existing user skills
    const skills = fs.readdirSync(skillsSrc, { withFileTypes: true });
    for (const skill of skills) {
      if (skill.isDirectory()) {
        const skillSrcPath = path.join(skillsSrc, skill.name);
        const skillDestPath = path.join(skillsDest, skill.name);

        // Remove existing skill if present (update)
        if (fs.existsSync(skillDestPath)) {
          fs.rmSync(skillDestPath, { recursive: true });
        }

        copyDir(skillSrcPath, skillDestPath);
      }
    }
    console.log(`  ${green}✓${reset} Installed skills (${skills.filter(s => s.isDirectory()).length} skills)`);
  }

  if (!isGlobal) {
    installCodexWrappers(process.cwd());
  } else if (withCodexGlobal) {
    installGlobalCodexSkills();
  } else {
    console.log(`  ${dim}i${reset} Skipped global Codex skills (use --with-codex-global to install in ~/.codex/skills)`);
  }

  console.log(`
  ${green}Done!${reset}

  ${yellow}Commands available:${reset}
${commandListText}

  ${yellow}Skills installed (16 skills):${reset}
    ${cyan}Discipline:${reset}
    /debugging          Systematic root cause analysis (Iron Law)
    /testing            Test-driven development (Red-Green-Refactor)
    /verifying          Evidence before completion claims

    ${cyan}Workflow:${reset}
    /brainstorming      Turn ideas into validated designs
    /committing         Quality conventional commits
    /creating-pr        PRs with verification
    /receiving-feedback Handle code review with rigor

    ${cyan}Code Quality:${reset}
    /refactoring        Safe code restructuring
    /security-audit     OWASP vulnerabilities
    /explaining-code    Diagrams and analogies
    /scaffolding        Generate boilerplate

    ${cyan}Building:${reset}
    /frontend-design    Production-grade UI design
    /mcp-builder        Create MCP servers
    /web-artifacts-builder  Multi-component HTML artifacts
    /webapp-testing     Playwright browser testing
    /skill-creator      Create new skills

  ${yellow}Templates installed to:${reset}
    ${locationLabel}/atlas-templates/
`);
}

/**
 * Prompt for install location
 */
function promptLocation() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(`  ${yellow}Where would you like to install?${reset}

  ${cyan}1${reset}) Global ${dim}(~/.claude)${reset} - available in all projects
  ${cyan}2${reset}) Local  ${dim}(./.claude)${reset} - this project only
`);

  rl.question(`  Choice ${dim}[1]${reset}: `, (answer) => {
    rl.close();
    const choice = answer.trim() || '1';
    const isGlobal = choice !== '2';
    install(isGlobal, { withCodexGlobal: hasCodexGlobal });
  });
}

// Main
if (hasGlobal && hasLocal) {
  console.error(`  ${yellow}Cannot specify both --global and --local${reset}`);
  process.exit(1);
} else if (hasGlobal) {
  install(true, { withCodexGlobal: hasCodexGlobal });
} else if (hasLocal) {
  install(false, { withCodexGlobal: hasCodexGlobal });
} else {
  promptLocation();
}
