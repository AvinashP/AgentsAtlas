---
description: Complete current milestone and prepare for next work
allowed-tools: Read, Write, Edit, Glob, AskUserQuestion, Bash(git tag:*), Bash(git log:*), Bash(git status:*), Bash(mv:*), Bash(mkdir:*)
---

# Complete Milestone

Mark current milestone/feature as complete and prepare for next work.

## When to Use
- Finished all phases in current milestone
- Ready to start a new feature or milestone
- Want to archive completed work and reset

## Process

1. **Verify completion**:
   - Read STATE.md and ROADMAP.md
   - Check all phases are marked complete
   - If incomplete phases exist, warn user and ask to confirm

2. **Gather completion info** using AskUserQuestion:
   - "What version/name for this milestone?" (e.g., "v1.0.0", "MVP", "Auth Feature")
   - "Archive completed phases?" (Yes/No)
   - "Create git tag?" (Yes/No)
   - "What's next?" (New milestone / Continue adding phases / Done for now)

3. **Create completion summary**:
   Create `.planning/MILESTONES.md` (or append if exists):
   ```markdown
   ## {version} - {date}

   ### Completed Phases
   - Phase 1: {name} - {summary from SUMMARY.md}
   - Phase 2: {name} - {summary from SUMMARY.md}
   - Phase 3: {name} - {summary from SUMMARY.md}

   ### Stats
   - Phases: {N}
   - Plans executed: {N}
   - Total commits: {N}

   ### Key Deliverables
   - {from SUMMARY.md files}
   ```

4. **Archive if requested**:
   ```bash
   mkdir -p .planning/archive/{version}
   mv .planning/phases/* .planning/archive/{version}/
   mkdir .planning/phases
   ```

5. **Create git tag if requested**:
   ```bash
   git tag -a {version} -m "Milestone: {version}"
   ```

6. **Reset STATE.md for next work**:
   - Phase: 1 of N (ask how many new phases)
   - Phase Status: not-started
   - Plan Status: none
   - Clear Resume Point
   - Keep Deferred Issues (or ask to clear)
   - Next Action: "Run /atlas:plan to plan Phase 1"

7. **Update ROADMAP.md**:
   - If new milestone: Clear old phases, add new ones
   - If continuing: Keep completed phases checked, add new phases

8. **Output**:
   ```
   Milestone completed: {version}

   Archived: .planning/archive/{version}/
   Git tag: {version} (if created)

   Summary added to: .planning/MILESTONES.md

   Ready for next work:
   - Phases planned: {N}
   - Next: Run /atlas:plan to start Phase 1
   ```

## Quick Complete (No Archive)

If user just wants to move to next phase without archiving:
- Update STATE.md to next phase
- Don't archive
- Don't create milestone summary
- Just reset for next work

## Rules
- Always verify completion before archiving
- Keep MILESTONES.md as permanent history
- Deferred issues should transfer to new milestone unless explicitly cleared
- Git tag is optional but recommended for releases
