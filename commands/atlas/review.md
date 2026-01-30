---
description: Review code changes and capture learnings for CLAUDE.md
allowed-tools: Read, Write, Edit, Glob, Grep, AskUserQuestion, Bash(git diff:*), Bash(git log:*), Bash(git show:*), Bash(git status:*), Bash(gh pr:*), Bash(gh api:*), Bash(npm test:*), Bash(npm run test:*), Bash(npx vitest:*), Bash(npx jest:*), Bash(pytest:*), Bash(python -m pytest:*), Bash(go test:*), Bash(cargo test:*), Bash(bun test:*)
---

# Code Review

Review completed work for quality and capture learnings for CLAUDE.md.

## Reviewer Persona

Adopt the mindset of a senior engineer who:
- Maintains this codebase long-term
- Has been burned by subtle bugs before
- Cares about correctness over style
- Would rather miss a nitpick than miss a logic bug
- Values precision over recall (false positives erode trust)

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

2. **Verification (run tests first)**:
   - Detect test framework: look for `package.json` (npm/bun), `pytest.ini`/`pyproject.toml` (pytest), `go.mod` (go), `Cargo.toml` (rust)
   - Run the appropriate test command:
     ```bash
     npm test           # Node.js
     pytest             # Python
     go test ./...      # Go
     cargo test         # Rust
     bun test           # Bun
     ```
   - **Failing tests = automatic P0 issues** - no need to analyze further, the tests tell you what's broken
   - Note which tests cover the changed code (for test coverage assessment)
   - If no tests exist, note this as a P1 concern in the review

3. **Context gathering (read related files)**:
   - For each changed file, identify 1-2 files it imports or calls
   - Read those related files to understand HOW the changed code is used
   - Check CLAUDE.md for project-specific patterns and anti-patterns to look for
   - This context helps catch bugs that are invisible in the diff alone

4. **Review checklist**:
   - **Plan alignment**: All requirements from PLAN.md met?
   - **Security audit** (per /security-audit skill): See section below
   - **Deep logic review**: See section below - think hard about what could silently fail
   - **Testing**: Coverage present, edge cases handled
   - **Production readiness**: Breaking changes, migrations needed, backward compatibility
   - **Scope creep**: No unnecessary additions beyond plan
   - **Learnings**: Patterns that should be documented in CLAUDE.md

5. **Output format**:
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

6. **Offer to update CLAUDE.md**:
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

**This is the most important part of the review.** The goal is to find bugs that compile and run but do the wrong thing - code that "works" but produces incorrect output.

For each function changed, answer these questions:

1. **What are ALL the possible inputs?** (not just happy path)
   - Empty arrays, null, undefined?
   - Edge values (0, -1, MAX_INT)?
   - Malformed data?

2. **What happens to data as it flows through?**
   - Is anything dropped or overwritten?
   - Are transformations reversible when they should be?
   - Is ordering preserved when it matters?

3. **What does this code assume?**
   - Write down each assumption explicitly
   - Could any assumption be violated?

4. **How could this silently produce wrong output?**
   - Not crash, not throw - just wrong results
   - This is the hardest bug type to find

## What Real Bugs Look Like

Use these few-shot examples to calibrate what you're looking for. Real bugs often follow these patterns:

### Case Sensitivity Mismatch
```javascript
// Bug: Code lowercases but regex expects uppercase
const normalized = file.path.toLowerCase();
return /Gemfile$/.test(normalized);  // Never matches!
```
**Pattern**: Input normalization doesn't match the check that follows.

### Incomplete State Handling
```javascript
// Bug: Handles most statuses but misses one
switch (file.status) {
  case 'modified': /* ... */ break;
  case 'created': /* ... */ break;
  case 'deleted': /* ... */ break;
  // Missing: 'renamed' has both `from` and `to` paths!
}
```
**Pattern**: Exhaustive-looking switch/if that actually misses a case.

### Lossy Transformation
```javascript
// Bug: Dedup keeps last, but needed to merge first + last
const byPath = new Map();
for (const change of changes) {
  byPath.set(change.path, change);  // Overwrites previous!
}
// Result: Lost the "before" state from first entry
```
**Pattern**: Aggregation that overwrites instead of merges.

### Status vs Verification Conflation
```javascript
// Bug: Trusts status flag that doesn't mean what we think
if (pr.status === 'committed') {
  markAsVerified(pr);  // But commits can happen before CI runs!
}
```
**Pattern**: A status field that sounds authoritative but doesn't guarantee what the code assumes.

### Off-by-One in Boundaries
```javascript
// Bug: Fence-post error
for (let i = 0; i <= items.length; i++) {  // Should be <, not <=
  process(items[i]);  // Undefined on last iteration
}
```
**Pattern**: Loop bounds or slice indices that are off by one.

### Project-Specific Patterns

Also check CLAUDE.md for:
- Anti-patterns specific to this codebase
- Past bugs that were caught in reviews
- Domain-specific gotchas

These project-specific patterns often catch bugs that generic patterns miss.

## Security Audit (per /security-audit skill)

For every review, check OWASP Top 10 vulnerabilities in changed code:

1. **Map attack surface** in changed files:
   - API endpoints, form handlers, URL parameters
   - Database queries, file operations
   - Authentication/authorization checks

2. **Check for common vulnerabilities**:
   | Vulnerability | What to look for |
   |---------------|------------------|
   | **Injection** | User input in SQL, commands, templates without sanitization |
   | **Broken Auth** | Missing auth checks, weak session handling, exposed tokens |
   | **XSS** | User input rendered without escaping |
   | **Insecure Direct Object Ref** | IDs in URLs without ownership validation |
   | **Security Misconfiguration** | Debug modes, default credentials, verbose errors |
   | **Sensitive Data Exposure** | Secrets in code, unencrypted sensitive data, excessive logging |

3. **Severity classification**:
   - **P0 Security**: Exploitable vulnerability (injection, auth bypass) → Must fix before merge
   - **P1 Security**: Potential vulnerability (missing validation) → Should fix
   - **P2 Security**: Hardening opportunity (rate limiting, headers) → Nice to have

4. **Output format** (add to Issues section):
   ```
   #### Security Issues
   - [P0 SECURITY] file:line - SQL injection via unsanitized user input
     - Attack vector: POST /api/users with malicious `name` field
     - Fix: Use parameterized query
   ```

## Rules
- Be specific with references (file:line, not vague descriptions)
- Categorize by actual severity (don't inflate nitpicks to Critical)
- Acknowledge strengths before listing issues
- Always look for CLAUDE.md learnings (review improves future sessions)
- Focus on patterns, not one-off mistakes
- Don't repeat issues already documented in CLAUDE.md anti-patterns
- If no issues found, say so clearly and explain why code is solid
