---
description: Restore project context after /clear
allowed-tools: Read
---

# Sync Context

Refresh context after `/clear`. Use this to restore project awareness.

## When to Use
- After running `/clear` to free up context
- Starting a new session
- When Claude seems to have forgotten project details

## Process

1. **Read core files in order**:
   ```
   1. CLAUDE.md (project overview)
   2. .planning/STATE.md (current position)
   3. .planning/ROADMAP.md (phase overview)
   4. Current PLAN.md if exists (active work)
   ```

2. **Summarize back to user**:
```
## Context Restored

**Project**: {name} - {one-liner}
**Position**: Phase {N}/{total} - {status}
**Current Plan**: {plan_path or "none"}

**Recent decisions**:
{from STATE.md}

**Next action**: {from STATE.md}
```

3. **Check for issues**:
   - Missing files?
   - Stale STATE.md?
   - Orphaned plan?

4. **End with**:
```
---
Ready to continue. Run /atlas:status for full details or proceed with {next_action}.
```

## Rules
- This is a read-only operation
- Don't modify any files
- Be concise—user wants to get back to work
