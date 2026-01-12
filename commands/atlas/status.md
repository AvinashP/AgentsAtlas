# Check Status

Show current progress and suggest next action.

## Process

1. **Read state files**:
   - .planning/STATE.md
   - .planning/ROADMAP.md
   - Check for current PLAN.md if any

2. **Determine status**:
   - What phase are we on?
   - Is there a plan? Is it executed?
   - What's blocking (if anything)?

3. **Show summary**:
```
## Project Status

Phase: {N} of {total} - {phase_name}
Status: {not-started|planned|in-progress|complete}
Current Plan: {path or "none"}

## Roadmap
- [x] Phase 1: Foundation
- [ ] Phase 2: Auth ← current
- [ ] Phase 3: API

## Recent Activity
- {last commit or action}
- {previous action}

## Blockers
{any blockers from STATE.md or "None"}
```

4. **Suggest next action**:

| Current State | Next Action |
|---------------|-------------|
| No plan exists | `/atlas:plan` |
| Plan exists, not executed | `/atlas:execute` |
| Plan executed, phase incomplete | `/atlas:plan` (next sub-plan) |
| Phase complete | Update ROADMAP, `/atlas:plan` for next phase |
| All phases complete | Project done! |

5. **Output ends with**:
```
---
Next: {suggested_command} - {why}
```

## Rules
- Keep output concise
- Always end with a clear next action
- If something looks wrong, flag it
