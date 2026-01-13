---
description: Execute current plan via subagent with fresh context
allowed-tools: Task, Read, Write, Edit, Glob, Grep, Bash(git:*), Bash(npm:*), Bash(node:*), Bash(dotnet:*), Bash(ls:*)
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

DEVIATION RULES (follow strictly):
- AUTO-FIX: Bugs, broken imports, missing error handling → fix immediately, note in summary
- AUTO-ADD: Security gaps, critical validation → add and note in summary
- ASK FIRST: Schema changes, new dependencies, architecture changes → stop and ask user
- LOG TO STATE.md: Refactoring ideas, nice-to-haves → add to "Deferred Issues" section

After ALL tasks complete:
1. Create SUMMARY.md at `.planning/phases/{NN}-SUMMARY.md`:
   ```markdown
   # Phase {N}: {Name} - Summary

   ## Shipped
   - {substantive description of what was built}
   - {another deliverable}

   ## Files Changed
   - {file1.ts} - {what changed}
   - {file2.ts} - {what changed}

   ## Commits
   - {hash} - {message}

   ## Deviations
   - {any auto-fixes or auto-adds, or "None"}
   ```

2. Update .planning/STATE.md:
   - Set Status to "complete" for this plan
   - Clear Resume Point section
   - Add any deferred issues to Deferred Issues section

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

## Deviation Rules (Formalized)

| Type | Action | Example |
|------|--------|---------|
| **Auto-fix** | Fix immediately, note in SUMMARY.md | Bugs, broken imports, missing error handling |
| **Auto-add** | Add and note in SUMMARY.md | Security gaps, critical validation |
| **Ask first** | Stop execution, ask user | Schema changes, new dependencies, architecture |
| **Log for later** | Add to STATE.md Deferred Issues | Refactoring ideas, nice-to-haves, performance |

This prevents scope creep while ensuring critical issues are addressed.

## On Failure
If a task fails:
1. Subagent should stop and report what failed
2. Don't continue to next task
3. Return control to main for decision
