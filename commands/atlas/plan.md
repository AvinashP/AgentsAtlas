---
description: Create executable plan for current phase (3-5 tasks)
allowed-tools: Read, Write, Edit, Glob, Grep, AskUserQuestion, WebSearch, WebFetch, Bash(ls:*)
---

# Plan Phase

Create an executable plan for the current phase.

## Pre-requisites
- CLAUDE.md exists
- .planning/STATE.md exists

## Process

1. **Load context**:
   - Read CLAUDE.md
   - Read .planning/STATE.md
   - Read .planning/ROADMAP.md
   - If there's a previous phase summary, read it

2. **Check scope alignment**:
   - Read Current Scope from STATE.md
   - Ensure planned tasks align with Core Value
   - Flag if tasks seem outside "In Scope" items
   - Never plan tasks that are "Out of Scope"

3. **Identify current phase** from STATE.md

4. **Ask clarifying questions** using AskUserQuestion tool (if needed):
   - Only ask if the phase goal is unclear from ROADMAP.md
   - Use AskUserQuestion with options when possible (e.g., approach preferences)
   - Skip entirely if the phase is obvious from roadmap context

5. **Create PLAN.md** in `.planning/phases/`:
   - File: `.planning/phases/{NN}-PLAN.md` (e.g., `01-PLAN.md`)
   - Use XML task format
   - **Maximum 3-5 tasks** (this is critical for quality)
   - Each task must have: name, files, action, verify, done

6. **Task format**:
```xml
<task id="1">
<name>Clear task name</name>
<files>src/file1.ts, src/file2.ts</files>
<action>
Specific implementation steps:
1. Do X
2. Do Y
3. Do Z
</action>
<verify>npm test && curl -X POST /api/auth/login</verify>
<done>Login endpoint accepts email/password, returns JWT token</done>
</task>
```

**Field distinction**:
- `verify` = How to test (commands, checks to run)
- `done` = What success looks like (acceptance criteria)

7. **Update STATE.md**:
   - Current Plan: `{NN}-PLAN.md`
   - Status: `planned`

8. **Output**:
```
Plan created: .planning/phases/{NN}-PLAN.md

Tasks:
1. {task_name}
2. {task_name}
3. {task_name}

Next: Run /atlas:execute to implement this plan.
```

## Rules
- **3-5 tasks maximum**. If you need more, the phase is too big—split it.
- Tasks should be 15-45 min of implementation each.
- Be specific in actions. "Implement auth" is too vague. "Create login endpoint with JWT token generation" is right.
- Every task needs both `verify` (how to test) and `done` (acceptance criteria).
