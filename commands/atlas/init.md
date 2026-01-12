---
description: Initialize project with CLAUDE.md, STATE.md, and ROADMAP.md
allowed-tools: Read, Write, Edit, Bash(mkdir:*)
---

# Initialize Project

Initialize a new project with ClaudeAtlas workflow.

## Process

1. **Create .planning directory** if it doesn't exist

2. **Ask about the project**:
   - What are you building? (1 sentence)
   - What's the core value/problem it solves?
   - Tech stack (language, framework, database)?
   - Any key constraints? (timeline, dependencies, must-haves)

3. **Create CLAUDE.md** in project root using the template:
   - Keep it under 30 lines
   - Focus on what matters for context

4. **Create .planning/STATE.md**:
   - Set Phase 1 of N (ask how many phases they envision)
   - Status: not-started
   - Next Action: "Run /atlas:plan to plan Phase 1"

5. **Create .planning/ROADMAP.md**:
   - List phases as checkboxes
   - Keep descriptions to 3-5 words each

6. **Output**:
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
