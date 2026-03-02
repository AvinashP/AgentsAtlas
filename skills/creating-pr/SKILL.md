---
name: creating-pr
description: Creates pull requests with quality descriptions. Use when asked to create a PR, open a pull request, or ship code for review. Requires test verification before PR creation.
---

# Creating PR Skill

Create pull requests with clear descriptions that enable efficient reviews.

## The Iron Law

```
NO PR WITHOUT PASSING TESTS
```

Before creating any PR, verify tests pass. No exceptions.

## Workflow

### 1. Verify Tests Pass (MANDATORY)

**Run full test suite before anything else:**

```bash
# Run tests and verify output
npm test        # or pytest, go test, etc.

# Check exit code
echo $?         # Must be 0
```

**If tests fail:** Fix them first. Do not proceed to PR.

### 2. Verify Branch State

```bash
# Check current branch
git branch --show-current

# Ensure all changes committed
git status

# Check commits to be included
git log main..HEAD --oneline

# Check diff against target branch
git diff main...HEAD --stat
```

### 3. Push Branch

```bash
# Push and set upstream
git push -u origin <branch-name>
```

### 4. Analyze Changes

**Understand the full scope:**
- What commits are included?
- What files changed?
- What's the user-visible impact?

```bash
# View all commits
git log main..HEAD

# View full diff
git diff main...HEAD
```

### 5. Write PR Description

**Title format:**
```
<type>: <short description>
```

Keep under 72 characters. Use imperative mood.

**Description structure:**

```markdown
## Summary
Brief explanation of what this PR does and why.

## Changes
- Bullet point of key changes
- Another change
- Third change

## Testing
How to test this PR:
1. Step one
2. Step two
3. Expected result

## Verification
- [x] All tests pass
- [x] Linting passes
- [ ] Manual testing completed

## Notes for Reviewers
- Any specific areas to focus on
- Known limitations
```

### 6. Create the PR

```bash
gh pr create --title "type: description" --body "$(cat <<'EOF'
## Summary
What and why.

## Changes
- Change 1
- Change 2

## Testing
1. How to test
2. Expected result

## Verification
- [x] All tests pass
EOF
)"
```

## Quick Reference

### PR Title Prefixes

| Prefix | When to Use |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `refactor:` | Code restructuring |
| `docs:` | Documentation |
| `test:` | Test changes |
| `chore:` | Maintenance |
| `perf:` | Performance |

### Good vs Bad Titles

```
# Good
feat: add user profile settings page
fix: prevent duplicate form submissions
refactor: extract authentication to middleware

# Bad
Update code
WIP
Fixes
John's changes
```

### Pre-PR Checklist

Before creating PR:
- [ ] Tests pass locally
- [ ] Linting passes
- [ ] No merge conflicts with target branch
- [ ] Commits are clean and well-messaged
- [ ] PR description is complete

### Description Tips

**Do:**
- Lead with "why" not "what"
- Include testing instructions
- Note breaking changes
- Reference issues/tickets
- Add screenshots for UI changes

**Don't:**
- Create PR with failing tests
- Repeat the diff in prose
- Leave empty description
- Forget to mention risks

### Linking Issues

```markdown
## Summary
Implement user preferences dashboard.

Closes #123
Fixes #456
Related to #789
```

### Draft PRs

Use drafts when:
- Work in progress
- Want early feedback
- CI needs to run first

```bash
gh pr create --draft --title "WIP: feature name"
```

## PR Templates

### Feature PR

```markdown
## Summary
Add [feature] to allow users to [benefit].

## Changes
- Add [component/module]
- Update [existing code]
- Add [tests/docs]

## Testing
1. Navigate to [location]
2. Click [action]
3. Verify [expected behavior]

## Verification
- [x] Tests pass
- [x] Linting passes
- [ ] Manual testing done

## Checklist
- [ ] Tests added
- [ ] Documentation updated
- [ ] No console errors
```

### Bug Fix PR

```markdown
## Summary
Fix [bug] that caused [problem] when [condition].

## Root Cause
[Explanation of why the bug occurred]

## Solution
[How this PR fixes it]

## Testing
1. Previously: [reproduce bug]
2. Now: [verify fix]
3. Regression: [verify no side effects]

## Verification
- [x] Tests pass (including new regression test)
- [x] Bug no longer reproducible

Fixes #[issue-number]
```

### Refactoring PR

```markdown
## Summary
Refactor [area] to [improvement].

## Motivation
- [Why this refactoring is needed]
- [What problems it solves]

## Changes
- Extract [X] into [Y]
- Rename [A] to [B]
- Consolidate [duplicated code]

## Verification
- [x] All existing tests pass
- [x] No functional changes
- [x] Performance unchanged

## Notes
This is a pure refactoring with no behavioral changes.
```

## See Also

- [templates.md](./templates.md) - More PR templates by scenario
