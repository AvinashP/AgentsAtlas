# ClaudeAtlas

A minimal, effective workflow for building production-ready projects with Claude Code.

## Philosophy

- **5 commands** to manage any project
- **Fresh context** via subagent execution (no degradation)
- **XML task format** with verification steps
- **3-5 tasks per plan** (quality over quantity)
- **Atomic commits** per task

## Commands

| Command | Purpose |
|---------|---------|
| `/atlas:init` | Initialize project with CLAUDE.md + STATE.md |
| `/atlas:plan` | Create executable plan (3-5 tasks max) |
| `/atlas:execute` | Run plan with fresh subagent context |
| `/atlas:status` | Check progress, get next action |
| `/atlas:sync` | Restore context after `/clear` |

## Installation

### Option 1: npx (Recommended)

```bash
# Install globally (available in all projects)
npx claude-atlas --global

# Or install locally (current project only)
npx claude-atlas --local
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
<verify>
- curl POST /api/auth/login returns 200 + token
- Invalid credentials return 401
- Token decodes correctly
</verify>
</task>
```

## Why This Works

1. **Small plans** = Focused execution, fewer mistakes
2. **Fresh context** = Consistent quality across tasks
3. **Verification steps** = Catch issues immediately
4. **Atomic commits** = Easy rollback, clear history
5. **STATE.md** = Session continuity without bloat

## Customization

Edit the command files in `commands/atlas/` to adjust:
- Task limits
- Commit format
- Deviation rules
- Output format

## License

MIT
