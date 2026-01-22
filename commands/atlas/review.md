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
   - **Code quality**: Error handling, types, DRY principle
   - **Architecture**: SOLID principles, separation of concerns
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

   #### Critical (Must Fix)
   [Bugs, security issues, data loss risks - with file:line]

   #### Important (Should Fix)
   [Architecture problems, missing tests, poor error handling - with file:line]

   #### Minor (Nice to Have)
   [Style, optimization, documentation - with file:line]

   ### CLAUDE.md Learnings
   Patterns to add to CLAUDE.md:
   - [Anti-pattern observed → rule to add]
   - [Good pattern → document for consistency]

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

- **Critical**: Security vulnerabilities, data loss, crashes, blocking bugs
- **Important**: Missing error handling, no tests for new code, architectural violations, missing validation
- **Minor**: Style inconsistencies, minor optimizations, documentation gaps, nitpicks

## Rules
- Be specific with references (file:line, not vague descriptions)
- Categorize by actual severity (don't inflate nitpicks to Critical)
- Acknowledge strengths before listing issues
- Always look for CLAUDE.md learnings (review improves future sessions)
- Focus on patterns, not one-off mistakes
- Don't repeat issues already documented in CLAUDE.md anti-patterns
- If no issues found, say so clearly and explain why code is solid
