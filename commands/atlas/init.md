---
description: Initialize project with CLAUDE.md, STATE.md, and ROADMAP.md
allowed-tools: Read, Write, Edit, Glob, AskUserQuestion, Bash(mkdir:*), Bash(git init:*), Bash(ls:*)
---

# Initialize Project

Initialize a new project with ClaudeAtlas workflow.

## Process

1. **Check existing setup**:
   - If `.git` doesn't exist, offer to run `git init`
   - If CLAUDE.md exists, just append STATE.md reference (don't replace)
   - If .planning/ exists, confirm before overwriting

2. **Create .planning directory** if it doesn't exist

3. **Ask about the project** using AskUserQuestion tool:
   Use a single AskUserQuestion call with these questions:
   - "What are you building?" (free text - 1 sentence description)
   - "What's the tech stack?" (options: detect from codebase if brownfield, or ask)
   - "How many phases do you envision?" (options: 2-3, 4-5, 6+)

   For brownfield projects, pre-fill detected info and ask for confirmation.

4. **Create or update CLAUDE.md**:
   - If CLAUDE.md exists: just add "## Current State" section with link to STATE.md
   - If new: create using template, keep under 30 lines

5. **Create .planning/STATE.md**:
   - Set Phase 1 of N (ask how many phases they envision)
   - Status: not-started
   - Next Action: "Run /atlas:plan to plan Phase 1"

6. **Create .planning/ROADMAP.md**:
   - List phases as checkboxes
   - Keep descriptions to 3-5 words each

7. **Output**:
```
Project initialized.

Files created:
- CLAUDE.md (project context)
- .planning/STATE.md (current state)
- .planning/ROADMAP.md (phase overview)

Next: Run /atlas:plan to create your first execution plan.
```

## For Existing Codebases (Brownfield)

If code already exists, briefly scan and note in CLAUDE.md:
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
