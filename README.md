# AgentsAtlas

[![npm version](https://img.shields.io/npm/v/agents-atlas)](https://www.npmjs.com/package/agents-atlas)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node >= 16](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)](https://nodejs.org)

**A minimal workflow for building production-ready projects with Claude Code & Codex.**
8 commands. Fresh context via subagent execution. Quality execution.

<img width="476" height="302" alt="AgentsAtlas" src="https://github.com/user-attachments/assets/c0936781-d5f4-403b-91ce-7d1328945265" />

## Quick Start

```bash
npx agents-atlas --global
```

Then in any project:

```bash
/atlas:init       # Set up project with CLAUDE.md + STATE.md
/atlas:plan       # Create a 3-5 task plan for current phase
/atlas:execute    # Run plan with fresh subagent context
```

## What You Get

- **8 slash commands** that manage any project end-to-end
- **Fresh 200k-token context** per task via subagent execution — no degradation
- **XML task format** with built-in verification steps
- **16 development skills** (debugging, testing, security audit, and more)
- **Works with both Claude Code and Codex**

## Table of Contents

- [Installation](#installation)
- [Commands](#commands-claude-code)
- [Using with Codex](#using-with-codex)
- [Skills](#skills)
- [Workflow](#workflow)
- [Project Structure](#project-structure)
- [Task Format](#task-format)
- [Why This Works](#why-this-works)
- [Customization](#customization)
- [License](#license)

## Installation

### Option 1: npx (Recommended)

```bash
# Install globally (available in all projects)
npx agents-atlas --global

# Or install locally (current project only)
npx agents-atlas --local

# Global commands + global Codex skills
npx agents-atlas --global --with-codex-global
```

`--local` also installs Codex wrappers in your repo (`.agents/skills/atlas-*`, `scripts/atlas-*`, and `.codex/config.toml`).
Use `--with-codex-global` when installing globally to install Atlas skills in `~/.codex/skills/atlas-*` so they are available across projects (project-local skills can still override them).

### Option 2: From GitHub

```bash
git clone https://github.com/AvinashP/AgentsAtlas.git
cd AgentsAtlas
node bin/install.js --global
```

### Option 3: Manual Symlink

```bash
git clone https://github.com/AvinashP/AgentsAtlas.git
ln -s $(pwd)/AgentsAtlas/commands/atlas ~/.claude/commands/atlas
```

## Commands (Claude Code)

| Command | Purpose |
|---------|---------|
| `/atlas:init` | Initialize project with CLAUDE.md + STATE.md |
| `/atlas:plan` | Create executable plan (3-5 tasks max) |
| `/atlas:execute` | Run plan with fresh subagent context |
| `/atlas:status` | Check progress, get next action |
| `/atlas:review` | Review code changes, capture learnings for CLAUDE.md |
| `/atlas:sync` | Restore context after `/clear` |
| `/atlas:triage` | Pull and triage issues from Sentry, GitHub, etc. |
| `/atlas:complete` | Complete milestone, archive, and prepare for next work |

## Using with Codex

Atlas appears in Codex as **skills**, not `/atlas:*` slash commands.

1. Open Codex in a project.
2. Run `/skills` (or press `$`) and select any `atlas-*` skill.

Skill precedence:
- **Global skills**: `~/.codex/skills/atlas-*` (installed by `--global --with-codex-global`)
- **Project-local skills**: `.agents/skills/atlas-*` (override global skills when present)

Quick verification:

```bash
ls ~/.codex/skills/atlas-plan/SKILL.md
```

See [docs/ai-workflow.md](docs/ai-workflow.md) for the full Codex integration guide.

## Skills

AgentsAtlas includes **16 development skills** that provide disciplined workflows:

| Category | Skills |
|----------|--------|
| **Discipline** | `debugging`, `testing`, `verifying` |
| **Process** | `brainstorming`, `receiving-feedback` |
| **Git** | `committing`, `creating-pr` |
| **Code Quality** | `refactoring`, `security-audit` |
| **Utility** | `explaining-code`, `scaffolding` |
| **Building** | `frontend-design`, `mcp-builder`, `web-artifacts-builder`, `webapp-testing`, `skill-creator` |

The first 11 skills emphasize the **Iron Law** approach — finding root causes before fixes, evidence before claims, and test-driven development. The building skills (from Anthropic) provide production-grade UI design, MCP server creation, and testing capabilities.

## Workflow

```
/atlas:init          # Once per project
    ↓
/atlas:plan          # Plan current phase (3-5 tasks)
    ↓
/atlas:execute       # Execute with fresh context
    ↓
/atlas:status        # What's next?
    ↓
(repeat plan → execute → status)
```

### Bug Triage Workflow

```
/atlas:triage        # Pull issues from Sentry/GitHub/JIRA
    ↓
/atlas:plan          # Plan fixes for selected issues
    ↓
/atlas:execute       # Execute fix plan
```

### Milestone Completion

```
(all phases complete)
    ↓
/atlas:complete      # Archive, tag, prepare for next work
    ↓
/atlas:plan          # Start new milestone
```

### Code Review

```
/atlas:review        # Review current phase's changes
    ↓
(address issues if any)
    ↓
/atlas:complete      # Or continue to next phase

# Or review a PR:
/atlas:review --pr 123  # Review GitHub PR, suggest CLAUDE.md additions
```

### Context Management

```
When context degrades:
1. Run /clear
2. Run /atlas:sync
3. Continue working

The subagent execution pattern means each plan runs
with fresh 200k tokens—no accumulated noise.
```

## Project Structure

After `/atlas:init`, your project will have:

```
your-project/
├── CLAUDE.md              # Project context (< 30 lines)
└── .planning/
    ├── STATE.md           # Current position + recent decisions
    ├── ROADMAP.md         # Phase checklist
    └── phases/
        ├── 01-PLAN.md     # Phase 1 execution plan
        ├── 02-PLAN.md     # Phase 2 execution plan
        └── ...
```

## Task Format

Plans use XML for clarity:

```xml
<task id="1">
<name>Create user authentication endpoint</name>
<files>src/api/auth.ts, src/lib/jwt.ts</files>
<action>
1. Create POST /api/auth/login endpoint
2. Validate email/password against database
3. Generate JWT token on success
4. Return token with 24h expiry
</action>
<verify>curl -X POST /api/auth/login -d '{"email":"test@example.com","password":"test"}'</verify>
<done>Login returns 200 + JWT token; invalid credentials return 401</done>
</task>
```

- `verify` = How to test (commands to run)
- `done` = Acceptance criteria (what success looks like)

## Why This Works

- **Small plans (3-5 tasks)** = Focused execution, fewer mistakes
- **Fresh context per task** = Consistent quality, no degradation across tasks
- **Verification steps** = Catch issues immediately, not at the end
- **Atomic commits** = Easy rollback, clear git history
- **STATE.md** = Session continuity without context bloat

See [Setup Tips](docs/setup-tips.md) for hooks, permissions, and advanced Claude Code configuration.

## Customization

Edit the command files in `commands/atlas/` to adjust:
- Task limits
- Commit format
- Deviation rules
- Output format

Codex wrapper metadata source of truth:
- `commands/atlas/manifest.json`
- Run `npm run sync:atlas` after manifest changes.

Artifacts regenerated by the sync script:
- `.agents/skills/atlas-*`
- `scripts/atlas-*`
- `AGENTS.md`
- `docs/ai-workflow.md`
- `.claude-plugin/plugin.json` command list

Maintainer checks:
- `npm run check:atlas`

## License

MIT
