#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const manifestPath = path.join(repoRoot, 'commands', 'atlas', 'manifest.json');
const pluginPath = path.join(repoRoot, '.claude-plugin', 'plugin.json');
const marketplacePath = path.join(repoRoot, '.claude-plugin', 'marketplace.json');
const packageJsonPath = path.join(repoRoot, 'package.json');
const workflowDocPath = path.join(repoRoot, 'docs', 'ai-workflow.md');
const agentsPath = path.join(repoRoot, 'AGENTS.md');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeFile(filePath, content, mode = null) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  if (mode !== null) {
    fs.chmodSync(filePath, mode);
  }
}

function quoteTomlString(value) {
  return JSON.stringify(value);
}

function renderSkill(command, commandDocPath) {
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

function renderScript(command) {
  const fullAutoLine = command.fullAuto ? 'CODEX_ARGS+=(--full-auto)\n' : '';
  return `#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "\${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

# Optional env overrides:
# - ATLAS_PROFILE=atlas-<command>
# - ATLAS_JSON=1
# - ATLAS_OUTPUT_LAST_MESSAGE=/tmp/last.txt
# - ATLAS_OUTPUT_SCHEMA=./schema.json
ATLAS_PROFILE="\${ATLAS_PROFILE:-atlas-${command.name}}"
PROMPT=${JSON.stringify(command.prompt)}

CODEX_ARGS=(exec --ephemeral --profile "$ATLAS_PROFILE")
${fullAutoLine}if [[ "\${ATLAS_JSON:-0}" == "1" ]]; then
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
}

function renderAgents(commands) {
  const skills = commands.map((c) => `- \`atlas-${c.name}\`: ${c.summary}.`).join('\n');
  const docs = commands.map((c) => `- \`commands/atlas/${c.name}.md\``).join('\n');
  return `# Atlas Workflow

Use Atlas skills as thin routers to canonical Claude command docs.

## Planning State

- \`.planning/STATE.md\` tracks current status, active phase, and current plan file.
- \`.planning/ROADMAP.md\` defines milestones/phases and target outcomes.
- \`.planning/phases/{NN}-PLAN.md\` stores the active executable phase plan.
- \`.planning/phases/{NN}-SUMMARY.md\` stores execution outcomes and deviations.

## Skills to Use

${skills}

## Canonical Command Docs

${docs}

## Sync Workflow Artifacts

- Source of truth: \`commands/atlas/manifest.json\`
- Re-generate wrappers/docs/plugin command list: \`node scripts/sync-atlas-artifacts.mjs\`
`;
}

function renderWorkflowDoc(commands) {
  const skillBullets = commands.map((c) => `- \`atlas-${c.name}\``).join('\n');
  const scriptLines = commands.map((c) => `./scripts/atlas-${c.name}`).join('\n');
  const docs = commands.map((c) => `- \`commands/atlas/${c.name}.md\``).join('\n');

  return `# AI Workflow (Atlas Commands via Codex Skills)

This repo maps Atlas Claude commands to Codex skills and wrapper scripts.

## Interactive (Codex CLI)

1. Start Codex CLI in repo root.
2. Use \`/skills\` (or type \`$\`) to open the skill picker.
3. Choose one of:
${skillBullets}

Global availability option:
- Run \`npx claude-atlas --global --with-codex-global\` once to install Atlas skills at \`~/.codex/skills/atlas-*\`.
- Project-local skills in \`.agents/skills\` can override global skills.

## Fresh Context Scripts

Run from repo root:

\`\`\`bash
${scriptLines}
\`\`\`

Defaults:
- Scripts run \`codex exec --ephemeral --profile atlas-<command>\`.
- \`./scripts/atlas-execute\` also passes \`--full-auto\`.

Optional script env vars:
- \`ATLAS_PROFILE=atlas-<command>\` to override profile.
- \`ATLAS_JSON=1\` to emit JSONL events.
- \`ATLAS_OUTPUT_LAST_MESSAGE=/path/file.txt\` for final answer capture.
- \`ATLAS_OUTPUT_SCHEMA=/path/schema.json\` for schema-constrained output.

## Project Codex Profiles

- Profiles are defined in \`.codex/config.toml\`.
- Atlas wrappers use \`atlas-<command>\` profile names by default.

## Maintainer Sync

- Source of truth: \`commands/atlas/manifest.json\`
- Re-generate wrappers/docs/plugin command list: \`node scripts/sync-atlas-artifacts.mjs\`

## Expected Files and State Flow

1. \`.planning/STATE.md\` points to the active plan in \`.planning/phases/\`.
2. Planning updates \`.planning/phases/{NN}-PLAN.md\` and state status.
3. Execution applies plan tasks, runs verification, and updates state.
4. Completion/review workflows may update summaries and CLAUDE-guidance artifacts.
5. Sync/status workflows read state and report next action/resume point.

## Canonical Command Docs (Source of Truth)

${docs}
`;
}

function renderCodexConfig(commands) {
  const lines = [
    '# Project-scoped Codex profiles for Atlas wrappers.',
    '# CLI flags override profiles; profiles override global user config.',
    ''
  ];

  for (const command of commands) {
    const isReadOnly = command.name === 'status' || command.name === 'sync';
    const reasoning = command.name === 'execute' ? 'high' : 'medium';
    lines.push(`[profiles.atlas-${command.name}]`);
    lines.push(`approval_policy = ${quoteTomlString('on-request')}`);
    lines.push(`sandbox_mode = ${quoteTomlString(isReadOnly ? 'read-only' : 'workspace-write')}`);
    lines.push(`model_reasoning_effort = ${quoteTomlString(reasoning)}`);
    lines.push(`web_search = ${quoteTomlString('cached')}`);
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

function syncSkills(commands) {
  for (const command of commands) {
    const skillPath = path.join(repoRoot, '.agents', 'skills', `atlas-${command.name}`, 'SKILL.md');
    const content = renderSkill(command, `commands/atlas/${command.name}.md`);
    writeFile(skillPath, content);
  }
}

function syncScripts(commands) {
  for (const command of commands) {
    const scriptPath = path.join(repoRoot, 'scripts', `atlas-${command.name}`);
    writeFile(scriptPath, renderScript(command), 0o755);
  }
}

function syncPlugin(commands) {
  const plugin = readJson(pluginPath);
  plugin.commands = commands.map((command) => `./commands/atlas/${command.name}.md`);
  plugin.description = `Minimal workflow for Claude Code - ${commands.length} commands, fresh context, quality execution`;
  writeFile(pluginPath, `${JSON.stringify(plugin, null, 2)}\n`);
}

function syncMetadata(commands) {
  const description = `Minimal workflow for Claude Code - ${commands.length} commands, fresh context, quality execution`;

  const pkg = readJson(packageJsonPath);
  pkg.description = description;
  writeFile(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);

  const marketplace = readJson(marketplacePath);
  if (Array.isArray(marketplace.plugins)) {
    for (const plugin of marketplace.plugins) {
      if (plugin.name === 'claude-atlas') {
        plugin.description = description;
      }
    }
  }
  writeFile(marketplacePath, `${JSON.stringify(marketplace, null, 2)}\n`);
}

function syncOtherDocs(commands) {
  writeFile(agentsPath, renderAgents(commands));
  writeFile(workflowDocPath, renderWorkflowDoc(commands));
  writeFile(path.join(repoRoot, '.codex', 'config.toml'), renderCodexConfig(commands));
}

function main() {
  const manifest = readJson(manifestPath);
  const commands = manifest.commands;
  if (!Array.isArray(commands) || commands.length === 0) {
    throw new Error(`No commands found in ${manifestPath}`);
  }

  syncSkills(commands);
  syncScripts(commands);
  syncPlugin(commands);
  syncMetadata(commands);
  syncOtherDocs(commands);
  console.log(`Synced Atlas artifacts for ${commands.length} commands.`);
}

main();
