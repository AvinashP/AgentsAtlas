---
description: Check project progress and suggest next action
allowed-tools: Read, Glob, Bash(git log:*), Bash(git status:*), Bash(git diff:*)
---

# Check Status

Show current progress and suggest next action.

## Process

1. **Read state files**:
   - .planning/STATE.md
   - .planning/ROADMAP.md
   - Check for current PLAN.md if any
   - Check for SUMMARY.md files

2. **Check for resume point**:
   - If STATE.md has a Resume Point section with content, work was paused mid-execution
   - Display resume information prominently

3. **Determine status**:
   - What phase are we on?
   - Is there a plan? Is it executed?
   - Is there incomplete work (resume point)?
   - What's blocking (if anything)?

4. **Show summary**:
```
## Project Status

Phase: {N} of {total} - {phase_name}
Status: {not-started|planned|in-progress|paused|complete}
Current Plan: {path or "none"}

## Resume Point (if paused)
⚠️ Work was paused mid-execution:
- Plan: {plan_path}
- Task: {N} of {total}
- Last completed: {task_name}
- Notes: {context}

## Roadmap
- [x] Phase 1: Foundation
- [ ] Phase 2: Auth ← current
- [ ] Phase 3: API

## Recent Activity
- {last commit or action}
- {previous action}

## Deferred Issues
{issues from STATE.md or "None"}

## Blockers
{any blockers from STATE.md or "None"}
```

5. **Suggest next action**:

| Current State | Next Action |
|---------------|-------------|
| Resume point exists | `/atlas:execute` (will resume from pause point) |
| No plan exists | `/atlas:plan` |
| Plan exists, not executed | `/atlas:execute` |
| Plan executed, phase incomplete | `/atlas:plan` (next sub-plan) |
| Phase complete | Update ROADMAP, `/atlas:plan` for next phase |
| All phases complete | Project done! |

6. **Output ends with**:
```
---
Next: {suggested_command} - {why}
```

## Pause Work

If user wants to pause mid-execution, update STATE.md Resume Point:
```markdown
## Resume Point
- Plan: .planning/phases/01-PLAN.md
- Task: 2 of 3
- Completed: Task 1 (create database schema)
- In Progress: Task 2 (create API endpoints)
- Notes: Halfway through endpoint implementation
```

This enables clean resume on next session.

## Rules
- Keep output concise
- Always end with a clear next action
- If something looks wrong, flag it
- If resume point exists, make it prominent
