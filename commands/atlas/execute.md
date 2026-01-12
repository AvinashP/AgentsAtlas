---
description: Execute current plan via subagent with fresh context
allowed-tools: Task, Read, Write, Edit, Bash(git:*)
---

# Execute Plan

Execute the current plan using a subagent for fresh context.

## Pre-requisites
- Current PLAN.md exists (check STATE.md for path)

## Process

1. **Load the plan**:
   - Read STATE.md to find current plan path
   - Read the PLAN.md file

2. **Spawn subagent** using Task tool:
   - Pass the full plan content
   - Include CLAUDE.md context
   - Include any files listed in plan's "Context Required"

3. **Subagent prompt template**:
```
Execute this plan. For each task:
1. Implement the action steps
2. Run the verify step
3. Make an atomic git commit: `feat({phase}): {task_name}`

After ALL tasks complete:
- Update .planning/STATE.md with completion status
- Create brief summary (5-10 lines) of what was built

Plan:
{PLAN_CONTENT}

Project Context:
{CLAUDE_MD_CONTENT}
```

4. **After subagent completes**:
   - Verify STATE.md was updated
   - Check git log for commits
   - Report results

5. **Output**:
```
Plan executed.

Completed:
- [x] Task 1: {name}
- [x] Task 2: {name}
- [x] Task 3: {name}

Commits: {N} commits made
Files changed: {list}

Next: Run /atlas:status to see what's next.
```

## Why Subagent?
Fresh 200k token context = no degradation. The subagent starts clean, executes with full attention, and returns results. Main context stays lean.

## Deviation Rules
The subagent should:
- **Auto-fix**: Bugs, missing error handling, broken imports
- **Auto-add**: Critical validation, security checks
- **Ask first**: Schema changes, new dependencies, architectural changes
- **Log for later**: Refactoring ideas, performance improvements, nice-to-haves

## On Failure
If a task fails:
1. Subagent should stop and report what failed
2. Don't continue to next task
3. Return control to main for decision
