---
description: Initialize project with CLAUDE.md, STATE.md, and ROADMAP.md
allowed-tools: Read, Write, Edit, Glob, AskUserQuestion, Bash(mkdir:*), Bash(git init:*), Bash(git status:*), Bash(git rev-parse:*), Bash(ls:*), Bash(cp:*)
---

# Initialize Project

Initialize a new project with AgentsAtlas workflow.

## Process

1. **Detect mode**:
   - Check if the user's message includes `--auto`
   - If `--auto`: follow the **Non-Interactive Path** (step 3a)
   - Otherwise: follow the **Interactive Path** (step 3b, current behavior)

2. **Check existing setup** (mode-aware):
   - If `--auto`: do NOT prompt. Apply deterministic safety behavior in step 3a.
   - Otherwise (interactive path):
     - If `.git` doesn't exist, offer to run `git init`
     - If CLAUDE.md exists, just append STATE.md reference (don't replace)
     - If .planning/ exists, confirm before overwriting

3a. **Non-Interactive Path** (when `--auto` is specified):

   Skip ALL AskUserQuestion calls — including safety gates. Instead:

   a. **Safety gates (deterministic, no prompts)**:
      - Git safety check:
        1. Run `git rev-parse --is-inside-work-tree`
        2. If `true`: already inside a repo; **do not** run `git init`
        3. If `false` and local `.git` doesn't exist: run `git init`
      - `CLAUDE.md` exists → append STATE.md reference (don't replace), same as interactive
      - `.planning/` exists → **skip overwrite, leave existing files intact**.
        Only create files that don't already exist. Log which files were skipped.
      - `.planning/` missing → create it before generating STATE.md/ROADMAP.md.
      - Precedence rule (for all generated artifacts): if target file exists, skip and do not modify.
        Exception: for existing `CLAUDE.md`, only append STATE.md link if missing.

   b. **Scan codebase** for objective facts:
      - Config files: package.json, pyproject.toml, Cargo.toml, go.mod, pom.xml
      - Parse for: project name, description, language, framework, dependencies
      - Scan structure: key directories, entry points, test framework
      - Classify: greenfield (no source files) vs brownfield (existing code)

   c. **Generate CLAUDE.md** (if missing):
      - Project name: from config file `name` field, or directory name
      - Description: from config file `description` field, or `[TODO: Add project description]`
      - Tech stack: from detected language/framework/dependencies
      - Codebase section: from directory scan (for brownfield)
      - Any field that cannot be detected: use `[TODO: ...]` with specific prompt

   d. **Generate STATE.md** (if missing):
      - Add warning at top: `> ⚠️ Auto-generated from codebase analysis. Review and update fields marked [TODO].`
      - What: config file description, or `[TODO: Describe what you're building]`
      - Core Value: `[TODO: What is the ONE thing that matters most?]`
      - In Scope: `[TODO: Define active requirements]` (do NOT infer intent from code structure)
      - Out of Scope: `[TODO: What's explicitly not in v1?]`
      - Constraints: list detected tech stack as constraints; add `[TODO: Add timeline, integration, or other constraints]`
      - Phase/Status/Next Action: same as interactive path

   e. **Generate ROADMAP.md** (if missing):
      - For brownfield: derive phases from existing structure if clear, otherwise single `[TODO: Define phases]`
      - For greenfield: `[TODO: Define project phases after running /atlas:plan]`

   f. **Verify hook**: skip entirely. Do not create `.atlas/verify.md`.

   g. Skip to step 9a (**Auto Output**).

3b. **Interactive Path** (default — current behavior):
   Create `.planning` directory if it doesn't exist, then continue with Scope Discovery below.

4. **Scope Discovery** (per /brainstorming skill, use adaptive questioning):
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

5. **Confirm scope** (decision gate):
   Summarize what you understood and use AskUserQuestion to confirm:
   - "Here's what I captured: [summary]. Ready to proceed?"
   - Options: "Yes, let's go", "Let me clarify something"
   - If they want to clarify, ask one follow-up then proceed

6. **Create or update CLAUDE.md**:
   - If CLAUDE.md exists: just add "## Current State" section with link to STATE.md
   - If new: create using template, keep under 30 lines

7. **Create .planning/STATE.md**:
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

8. **Create .planning/ROADMAP.md**:
   - List phases as checkboxes
   - Keep descriptions to 3-5 words each

9. **Offer verify hook** (optional):
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

9a. **Auto Output** (for `--auto` path):
```
Project initialized (auto mode).

Files created:
- CLAUDE.md (if missing)
- .planning/STATE.md (if missing)
- .planning/ROADMAP.md (if missing)

Files skipped (already existed):
- [list each skipped file path]

Notes:
- `.atlas/verify.md` not created in `--auto` mode
- Run `/atlas:init` without `--auto` for interactive scope capture
- Run `/atlas:plan` to create your first execution plan
```

10. **Output** (for interactive path):
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
- `--auto` flag: zero AskUserQuestion calls, visible [TODO] for all subjective fields
- Never infer subjective intent (Core Value, Out of Scope) from code structure
- [TODO: ...] markers must be visible text, not HTML comments
- `--auto` safety: never overwrite existing .planning/ files, skip verify hook creation
- `git init` safety: never initialize when already inside a parent Git worktree
