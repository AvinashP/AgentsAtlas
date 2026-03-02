---
description: Initialize project with CLAUDE.md, STATE.md, and ROADMAP.md
allowed-tools: Read, Write, Edit, Glob, AskUserQuestion, Bash(mkdir:*), Bash(git init:*), Bash(git status:*), Bash(ls:*), Bash(cp:*)
---

# Initialize Project

Initialize a new project with AgentsAtlas workflow.

## Process

1. **Check existing setup**:
   - If `.git` doesn't exist, offer to run `git init`
   - If CLAUDE.md exists, just append STATE.md reference (don't replace)
   - If .planning/ exists, confirm before overwriting

2. **Create .planning directory** if it doesn't exist

3. **Scope Discovery** (per /brainstorming skill, use adaptive questioning):
   Use the brainstorming approach: one question at a time, explore collaboratively.
   Max 4-5 questions total.

   **Question 1 - Open exploration**:
   "What do you want to build?"
   - Let user describe freely via "Other" option
   - Provide 2-3 common project types as starting options if helpful

   **Question 2 - Follow the thread**:
   Based on their response, ask a clarifying follow-up:
   - "You mentioned [X] — what would that look like?"
   - Present 2-3 interpretations based on what they said + "Something else"
   - This is adaptive, not a fixed question

   **Question 3 - Sharpen the core**:
   "If you could only nail ONE thing, what would it be?"
   - Extract key themes from their description
   - Offer as 2-4 options (e.g., "User experience", "Performance", "Simplicity")

   **Question 4 - Find boundaries**:
   "What's explicitly NOT in v1/this scope?"
   - Offer common exclusions based on project type:
     - For web apps: "Admin dashboard", "Mobile app", "Analytics"
     - For CLI tools: "GUI", "Plugin system", "Cloud sync"
     - For libraries: "CLI wrapper", "Web interface", "Database integration"
   - Always include "Nothing specific yet"

   **Question 5 - Ground in reality** (optional, combine with Q4 if simple):
   "Any hard constraints?"
   - Options: "Specific tech stack", "Timeline/deadline", "Must integrate with X", "None"

   **Key principles**:
   - Use AskUserQuestion for ALL questions with meaningful options
   - Adapt follow-ups based on responses (not a rigid checklist)
   - Don't ask about technical implementation details (that's Claude's job)
   - Skip questions if answers are obvious from context
   - For brownfield projects, pre-fill detected info and confirm

4. **Confirm scope** (decision gate):
   Summarize what you understood and use AskUserQuestion to confirm:
   - "Here's what I captured: [summary]. Ready to proceed?"
   - Options: "Yes, let's go", "Let me clarify something"
   - If they want to clarify, ask one follow-up then proceed

5. **Create or update CLAUDE.md**:
   - If CLAUDE.md exists: just add "## Current State" section with link to STATE.md
   - If new: create using template, keep under 30 lines

6. **Create .planning/STATE.md**:
   Populate the Current Scope section using responses from scope discovery:
   - **What**: User's description in their own words (2-3 sentences)
   - **Core Value**: The ONE thing they said matters most
   - **In Scope**: Active requirements extracted from their responses
   - **Out of Scope**: Exclusions they mentioned + why
   - **Constraints**: Tech stack, timeline, dependencies mentioned

   Also set:
   - Phase 1 of N (based on complexity of scope)
   - Status: not-started
   - Next Action: "Run /atlas:plan to plan Phase 1"

7. **Create .planning/ROADMAP.md**:
   - List phases as checkboxes
   - Keep descriptions to 3-5 words each

8. **Offer verify hook** (optional):
   Detect project type and offer to create `.atlas/verify.md`:
   - Unity project (Assets/ folder) → `~/.claude/atlas-templates/verify/unity.md`
   - Node project (package.json) → `~/.claude/atlas-templates/verify/fullstack.md`
   - Python project (requirements.txt, pyproject.toml) → `~/.claude/atlas-templates/verify/python.md`
   - Otherwise → `~/.claude/atlas-templates/verify/default.md`

   Use AskUserQuestion: "Create custom verification workflow?"
   - Yes, use detected template (copy from ~/.claude/atlas-templates/verify/)
   - Yes, create empty template
   - No, use inline verify commands

   If yes, copy the appropriate template to `.atlas/verify.md` in the project.

9. **Output**:
```
Project initialized.

Files created:
- CLAUDE.md (project context)
- .planning/STATE.md (current state)
- .planning/ROADMAP.md (phase overview)
- .atlas/verify.md (optional - custom verification)

Next: Run /atlas:plan to create your first execution plan.
```

## For Existing Codebases (Brownfield)

If code already exists, use /scaffolding skill's convention detection:
- Detect project type (React, Node, Python, etc.)
- Identify naming patterns (camelCase, snake_case)
- Note folder structure conventions
- Find existing patterns for similar code

Briefly scan and note in CLAUDE.md:
- Key directories (src/, lib/, tests/)
- Entry points (main.ts, index.js, app.py)
- Config files (package.json, tsconfig, .env.example)

Don't create separate analysis docs—just add a "Codebase" section to CLAUDE.md:
```markdown
## Codebase
- `src/` - Main application code
- `src/api/` - REST endpoints
- `tests/` - Jest test suite
- Entry: `src/index.ts`
```

One paragraph. Not 7 documents.

## Rules
- Don't over-ask. 4-5 questions max.
- Don't create unnecessary files.
