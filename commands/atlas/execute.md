---
description: Execute current plan via subagent with fresh context
allowed-tools: Task, Read, Write, Edit, Glob, Grep, AskUserQuestion, Bash(git:*), Bash(npm:*), Bash(yarn:*), Bash(pnpm:*), Bash(bun:*), Bash(node:*), Bash(python:*), Bash(pip:*), Bash(cargo:*), Bash(go:*), Bash(dotnet:*), Bash(make:*), Bash(docker:*), Bash(ls:*)
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
   - Include AGENTS.md context (if present)
   - Include CLAUDE.md context
   - Include any files listed in plan's "Context Required"

3. **Subagent prompt template**:
```
Execute this plan. For each task:

SKILL DISCIPLINES (follow these throughout):
- /testing: TDD Red-Green-Refactor cycle
- /verifying: Evidence before completion claims
- /debugging: Root cause before fixes
- /committing: Conventional commit format

PRE-IMPLEMENTATION (before each task):
1. Read files in the task's <files> section and their imports
2. Identify existing patterns:
   - Dependency structure (what classes/modules depend on what)
   - Naming conventions and code organization
   - How similar problems are solved elsewhere in the codebase
3. Check AGENTS.md instructions first (if present), then CLAUDE.md "Anti-patterns" section (if present)
4. Default: No new external dependencies unless task explicitly requires them
5. Respect existing architecture — match the patterns you found
6. If task requires deviating from patterns, ASK FIRST (per deviation rules)

IMPLEMENTATION (TDD cycle per /testing skill):
1. RED: Write failing test that proves task requirement works
   - Run test, verify it FAILS with expected error
   - If no test framework, write manual verification script
2. GREEN: Implement MINIMAL code to pass test
   - No extra features, no premature optimization
   - Run test, verify it PASSES
3. REFACTOR: Clean up if needed (keep tests green)

VERIFICATION (per /verifying skill):
Before ANY completion claim, follow this gate:
1. IDENTIFY: What command proves this works?
2. RUN: Execute the FULL command in fresh state
3. READ: Check complete output AND exit code
4. CONFIRM: Does output actually confirm success?
5. ONLY THEN: Claim task complete with evidence

If using `.atlas/verify.md`:
- Spawn verify subagent with task name, files changed, <verify> hint
- Only proceed if verify subagent reports success
If no `.atlas/verify.md`: Run the <verify> command directly

COMMITTING (per /committing skill):
After each task passes verification:
- Format: `type(scope): description`
- Types: feat, fix, refactor, test, docs, chore
- Scope: module or feature area
- Description: imperative mood, lowercase, no period
- Example: `feat(auth): add JWT token generation`

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
{AGENTS_MD_CONTENT}
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

## Verify Hooks

Projects can define custom verification by creating `.atlas/verify.md`:

```
your-project/
├── .atlas/
│   └── verify.md    # Custom verification workflow
├── CLAUDE.md
└── .planning/
```

When `.atlas/verify.md` exists, execute spawns a dedicated verify subagent after each task implementation. This allows project-specific verification (Unity tests, E2E tests, etc.) without changing the core workflow.

**Example Unity verify.md:**
```markdown
# Unity Verification
1. Run EditMode tests: `unity -batchmode -runTests -testPlatform EditMode`
2. Run PlayMode tests: `unity -batchmode -runTests -testPlatform PlayMode`
3. Check Unity.log for compile errors
```

**Example Full-Stack verify.md:**
```markdown
# Full-Stack Verification
1. Type check: `npm run typecheck`
2. Unit tests: `npm test`
3. Build: `npm run build`
```

If no `.atlas/verify.md` exists, falls back to running `<verify>` command directly.

## On Failure (per /debugging skill)

If a task fails, follow root cause investigation BEFORE proposing fixes:

1. **STOP** - No immediate fix attempts
2. **Investigate root cause**:
   - Read the COMPLETE error message
   - Reproduce the failure consistently
   - Trace data flow backward from failure point
   - Identify the ACTUAL cause (not symptoms)
3. **Document understanding**: "The failure occurs because X, caused by Y"
4. **Only then propose fix** based on root cause understanding
5. **Return control to main** for decision on how to proceed

Never guess at fixes. Understanding first, fixing second.
