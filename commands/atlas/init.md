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

## Rules
- Don't over-ask. 4-5 questions max.
- Don't create unnecessary files.
- If brownfield (existing code), briefly note key files in CLAUDE.md.
