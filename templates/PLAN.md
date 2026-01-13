# Phase {{N}}: {{PHASE_NAME}}

## Objective
{{WHAT_THIS_PHASE_ACCOMPLISHES}}

## Context Required
- CLAUDE.md
- STATE.md
{{ADDITIONAL_FILES_IF_ANY}}

---

## Tasks

<task id="1">
<name>{{TASK_NAME}}</name>
<files>{{FILES_TO_CREATE_OR_MODIFY}}</files>
<action>
{{SPECIFIC_IMPLEMENTATION_STEPS}}
</action>
<verify>{{HOW_TO_TEST}}</verify>
<done>{{ACCEPTANCE_CRITERIA}}</done>
</task>

<task id="2">
<name>{{TASK_NAME}}</name>
<files>{{FILES_TO_CREATE_OR_MODIFY}}</files>
<action>
{{SPECIFIC_IMPLEMENTATION_STEPS}}
</action>
<verify>{{HOW_TO_TEST}}</verify>
<done>{{ACCEPTANCE_CRITERIA}}</done>
</task>

<task id="3">
<name>{{TASK_NAME}}</name>
<files>{{FILES_TO_CREATE_OR_MODIFY}}</files>
<action>
{{SPECIFIC_IMPLEMENTATION_STEPS}}
</action>
<verify>{{HOW_TO_TEST}}</verify>
<done>{{ACCEPTANCE_CRITERIA}}</done>
</task>

---

## Completion Criteria
- [ ] All tasks verified
- [ ] Tests pass (if applicable)
- [ ] STATE.md updated
- [ ] Atomic commit made
