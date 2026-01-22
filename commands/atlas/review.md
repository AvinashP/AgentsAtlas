---
description: Review code changes and capture learnings for CLAUDE.md
allowed-tools: Read, Write, Edit, Glob, Grep, AskUserQuestion, Bash(git diff:*), Bash(git log:*), Bash(git show:*), Bash(git status:*), Bash(gh pr:*), Bash(gh api:*)
---

# Code Review

Review completed work for quality and capture learnings for CLAUDE.md.

## Usage

- `/atlas:review` - Review current phase's changes
- `/atlas:review {phase}` - Review specific phase (e.g., `01`)
- `/atlas:review --pr {number}` - Review GitHub PR

## Pre-requisites
- CLAUDE.md exists (for pattern reference)
- For internal review: .planning/STATE.md exists with current phase info
- For PR review: GitHub CLI (`gh`) authenticated

## Process (Internal Review)

1. **Load context**:
   - Read CLAUDE.md (existing patterns/anti-patterns)
   - Read .planning/STATE.md to identify current phase
   - Read current PLAN.md (or specified phase's plan from `.planning/phases/`)
   - Read SUMMARY.md if exists for that phase
   - Get git diff for the phase's commits:
     ```bash
     git log --oneline -10  # Find relevant commits
     git diff HEAD~N..HEAD  # Diff for phase work
     ```

2. **Review checklist**:
   - **Plan alignment**: All requirements from PLAN.md met?
   - **Deep logic review**: See section below - think hard about what could silently fail
   - **Testing**: Coverage present, edge cases handled
   - **Production readiness**: Breaking changes, migrations needed, backward compatibility
   - **Scope creep**: No unnecessary additions beyond plan
   - **Learnings**: Patterns that should be documented in CLAUDE.md

3. **Output format**:
   ```
   ## Review: Phase {N} - {Name}

   ### Strengths
   - [What's well done with file:line references]

   ### Issues

   #### P0 Critical (Must Fix)
   - file:line - Description
     - What happens: [incorrect behavior]
     - Fix: [specific fix]

   #### P1 Important (Should Fix)
   - file:line - Description

   #### P2 Minor (Nice to Have)
   - file:line - Description

   ### CLAUDE.md Learnings
   - [Pattern observed → rule to add]

   ### Verdict
   **Ready to proceed?** [Yes / No / With fixes]
   ```

4. **Offer to update CLAUDE.md**:
   If learnings identified, use AskUserQuestion:
   - "Add these learnings to CLAUDE.md?" (Yes/No)
   - If yes, append to appropriate section (Anti-patterns or Patterns)

## Process (PR Review)

1. **Load PR context**:
   ```bash
   gh pr view {number} --json title,body,files,comments
   gh pr diff {number}
   ```

2. **Read project CLAUDE.md** for existing patterns

3. **Review against**:
   - PR title and description/requirements
   - Linked issues if any (from PR body)
   - Project's CLAUDE.md patterns and anti-patterns

4. **Output**: Same format as internal review

5. **Optional actions** (ask user via AskUserQuestion):
   - "Post review comment to PR?" (Yes/No)
   - "Add learnings to CLAUDE.md?" (Yes/No)
   - If posting to PR: `gh pr review {number} --comment --body "..."`

## Issue Severity Guide

- **P0 Critical**: Security vulnerabilities, data loss, logic bugs that silently produce wrong output
- **P1 Important**: Missing error handling, incomplete state coverage, untested edge cases
- **P2 Minor**: Style, optimization, documentation

## Deep Logic Review

**This is the most important part of the review.** For each function/block changed, think hard:

1. **Trace the data flow**: What inputs come in? What transformations happen? What goes out?
2. **Find silent failures**: How could this produce wrong results without throwing an error?
3. **Check all cases**: What states/values can reach this code? Are ALL of them handled?
4. **Question assumptions**: What does this code assume? Could those assumptions be wrong?

**The goal is to find bugs that compile and run but do the wrong thing.** These are harder to catch than crashes - the code "works" but produces incorrect output.

Examples of what to look for:
- A filter that excludes cases it shouldn't
- A regex that never matches due to case/escaping
- A dedup that loses data it should preserve
- A status check that trusts a flag it shouldn't
- A transformation that corrupts or drops information

## Rules
- Be specific with references (file:line, not vague descriptions)
- Categorize by actual severity (don't inflate nitpicks to Critical)
- Acknowledge strengths before listing issues
- Always look for CLAUDE.md learnings (review improves future sessions)
- Focus on patterns, not one-off mistakes
- Don't repeat issues already documented in CLAUDE.md anti-patterns
- If no issues found, say so clearly and explain why code is solid
