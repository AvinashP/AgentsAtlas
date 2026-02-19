# ClaudeAtlas

A minimal, effective workflow for building production-ready projects with Claude Code.

<img width="476" height="302" alt="ClaudeAtlas" src="https://github.com/user-attachments/assets/c0936781-d5f4-403b-91ce-7d1328945265" />


## Philosophy

- **8 commands** to manage any project
- **Fresh context** via subagent execution (no degradation)
- **XML task format** with verification steps
- **3-5 tasks per plan** (quality over quantity)
- **Atomic commits** per task

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

## Installation

### Option 1: npx (Recommended)

```bash
# Install globally (available in all projects)
npx claude-atlas --global

# Or install locally (current project only)
npx claude-atlas --local

# Global commands + global Codex skills
npx claude-atlas --global --with-codex-global
```

`--local` also installs Codex wrappers in your repo (`.agents/skills/atlas-*`, `scripts/atlas-*`, and `.codex/config.toml`).
Use `--with-codex-global` when installing globally to install Atlas skills in `~/.codex/skills/atlas-*` so they are available across projects (project-local skills can still override them).

## Using with Codex

Atlas appears in Codex as **skills**, not `/atlas:*` slash commands.

1. Open Codex in a project.
2. Run `/skills` (or press `$`) and select:
- `atlas-init`
- `atlas-plan`
- `atlas-execute`
- `atlas-status`
- `atlas-sync`
- `atlas-triage`
- `atlas-complete`
- `atlas-review`

Skill precedence:
- Global skills: `~/.codex/skills/atlas-*` (installed by `--global --with-codex-global`)
- Project-local skills: `.agents/skills/atlas-*` (override global skills when present)

Quick verification:

```bash
ls ~/.codex/skills/atlas-plan/SKILL.md
```

### Option 2: From GitHub

```bash
# Clone and run installer
git clone https://github.com/AvinashP/ClaudeAtlas.git
cd ClaudeAtlas
node bin/install.js --global
```

### Option 3: Manual Symlink

```bash
# Clone and symlink
git clone https://github.com/AvinashP/ClaudeAtlas.git
ln -s $(pwd)/ClaudeAtlas/commands/atlas ~/.claude/commands/atlas
```

## Skills

ClaudeAtlas includes **16 development skills** that provide disciplined workflows:

| Category | Skills |
|----------|--------|
| **Discipline** | `debugging`, `testing`, `verifying` |
| **Process** | `brainstorming`, `receiving-feedback` |
| **Git** | `committing`, `creating-pr` |
| **Code Quality** | `refactoring`, `security-audit` |
| **Utility** | `explaining-code`, `scaffolding` |
| **Building** | `frontend-design`, `mcp-builder`, `web-artifacts-builder`, `webapp-testing`, `skill-creator` |

The first 11 skills emphasize the **Iron Law** approach—finding root causes before fixes, evidence before claims, and test-driven development. The building skills (from Anthropic) provide production-grade UI design, MCP server creation, and testing capabilities.


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

1. **Small plans** = Focused execution, fewer mistakes
2. **Fresh context** = Consistent quality across tasks
3. **Verification steps** = Catch issues immediately
4. **Atomic commits** = Easy rollback, clear history
5. **STATE.md** = Session continuity without bloat

## Recommended Claude Code Setup

These infrastructure tips complement Atlas for maximum productivity:

### Hooks (Auto-format on Edit)

Add to `.claude/settings.local.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "prettier --write \"$CLAUDE_FILE_PATH\" 2>/dev/null || true"
      }
    ]
  }
}
```

### Permissions (Pre-allow Safe Commands)

Pre-allow commands you run frequently:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run:*)",
      "Bash(npx:*)",
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Bash(git log:*)"
    ]
  }
}
```

### Parallel Sessions

For complex projects, run multiple Claude Code sessions:
- **Main terminal**: Atlas workflow (`/atlas:plan` → `/atlas:execute`)
- **Secondary terminals**: Quick fixes, tests, documentation
- **Browser tabs**: Claude.ai for research, explanations

Each session maintains its own context—use Atlas in your primary workflow session.

### @.claude in PR Comments

Enable team-wide CLAUDE.md contributions via GitHub Actions:

```yaml
# .github/workflows/claude-pr.yml
name: Claude PR Assistant
on:
  issue_comment:
    types: [created]

jobs:
  respond:
    if: contains(github.event.comment.body, '@.claude')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Claude
        run: |
          # Your Claude Code invocation here
          # See: https://docs.anthropic.com/en/docs/claude-code
```

This allows teammates to tag `@.claude` in PR comments for automated review suggestions.

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
