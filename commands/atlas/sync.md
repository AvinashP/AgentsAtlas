---
description: Restore project context after /clear
allowed-tools: Read, Glob
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
   2. .planning/STATE.md (current position + resume point)
   3. .planning/ROADMAP.md (phase overview)
   4. Current PLAN.md if exists (active work)
   5. Latest SUMMARY.md if exists (what was last completed)
   ```

2. **Check for resume point**:
   - If STATE.md has Resume Point section, work was paused mid-execution
   - This is critical context for continuing

3. **Summarize back to user**:
```
## Context Restored

**Project**: {name} - {one-liner}
**Position**: Phase {N}/{total} - {status}
**Current Plan**: {plan_path or "none"}

## Resume Point (if exists)
⚠️ Work was paused:
- Plan: {plan_path}
- Task: {N} of {total}
- Notes: {context from STATE.md}

**Recent decisions**:
{from STATE.md}

**Deferred issues**:
{from STATE.md or "None"}

**Next action**: {from STATE.md}
```

4. **Check for issues**:
   - Missing files?
   - Stale STATE.md?
   - Orphaned plan?
   - Resume point without matching plan?

5. **End with**:
```
---
Ready to continue. Run /atlas:status for full details or proceed with {next_action}.
```

## Rules
- This is a read-only operation
- Don't modify any files
- Be concise—user wants to get back to work
