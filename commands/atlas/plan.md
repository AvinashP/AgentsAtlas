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

2. **Identify current phase** from STATE.md

3. **Ask clarifying questions** (2-3 max):
   - What specifically should this phase accomplish?
   - Any preferences on approach?
   - Skip if the phase is obvious from roadmap

4. **Create PLAN.md** in `.planning/phases/`:
   - File: `.planning/phases/{NN}-PLAN.md` (e.g., `01-PLAN.md`)
   - Use XML task format
   - **Maximum 3-5 tasks** (this is critical for quality)
   - Each task must have: name, files, action, verify

5. **Task format**:
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
<verify>
How to confirm this works:
- Run: npm test
- Check: endpoint returns 200
</verify>
</task>
```

6. **Update STATE.md**:
   - Current Plan: `{NN}-PLAN.md`
   - Status: `planned`

7. **Output**:
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
- Every task needs a verify step.
