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

const banner = `
${cyan}   █████╗ ████████╗██╗      █████╗ ███████╗
  ██╔══██╗╚══██╔══╝██║     ██╔══██╗██╔════╝
  ███████║   ██║   ██║     ███████║███████╗
  ██╔══██║   ██║   ██║     ██╔══██║╚════██║
  ██║  ██║   ██║   ███████╗██║  ██║███████║
  ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝${reset}

  Claude Atlas ${dim}v${pkg.version}${reset}
  Minimal workflow for Claude Code
  7 commands. Fresh context. Quality execution.
`;

// Parse args
const args = process.argv.slice(2);
const hasGlobal = args.includes('--global') || args.includes('-g');
const hasLocal = args.includes('--local') || args.includes('-l');
const hasHelp = args.includes('--help') || args.includes('-h');

console.log(banner);

// Show help if requested
if (hasHelp) {
  console.log(`  ${yellow}Usage:${reset} npx claude-atlas [options]

  ${yellow}Options:${reset}
    ${cyan}-g, --global${reset}    Install globally (to ~/.claude)
    ${cyan}-l, --local${reset}     Install locally (to ./.claude)
    ${cyan}-h, --help${reset}      Show this help message

  ${yellow}Examples:${reset}
    ${dim}# Install globally${reset}
    npx claude-atlas --global

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

/**
 * Install to the specified directory
 */
function install(isGlobal) {
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

  console.log(`
  ${green}Done!${reset}

  ${yellow}Commands available:${reset}
    /atlas:init     Initialize project
    /atlas:plan     Plan current phase (3-5 tasks)
    /atlas:execute  Execute with fresh context
    /atlas:status   Check progress
    /atlas:sync     Restore context after /clear
    /atlas:triage   Pull issues from Sentry/JIRA/GitHub
    /atlas:complete Complete milestone and prepare next

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
    install(isGlobal);
  });
}

// Main
if (hasGlobal && hasLocal) {
  console.error(`  ${yellow}Cannot specify both --global and --local${reset}`);
  process.exit(1);
} else if (hasGlobal) {
  install(true);
} else if (hasLocal) {
  install(false);
} else {
  promptLocation();
}
