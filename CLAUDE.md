# Project: AgentsAtlas

## Overview
Minimal workflow for building production-ready projects with Claude Code & Codex.
8 commands, fresh context via subagent execution, quality execution.

## Tech Stack
- Language: JavaScript (Node.js >= 16)
- No build step — plain JS scripts and Markdown command files

## Key Directories
- `commands/atlas/` — Slash command definitions (Markdown)
- `skills/` — Development skill definitions (16 skills)
- `templates/` — Project templates (STATE.md, ROADMAP.md, etc.)
- `bin/install.js` — npx installer
- `scripts/sync-atlas-artifacts.mjs` — Syncs manifest → generated artifacts

## Development
- `npm run sync:atlas` — Regenerate artifacts from manifest
- `npm run check:atlas` — Syntax-check JS files
- Manifest source of truth: `commands/atlas/manifest.json`
