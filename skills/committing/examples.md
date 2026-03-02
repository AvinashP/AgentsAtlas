# Commit Message Examples

Real-world examples organized by type and scenario.

## By Type

### feat - New Features

```
feat(auth): add Google OAuth login

feat(cart): implement quantity adjustment

feat(search): add filters for price range

feat(notifications): add email digest option

feat(api): add pagination to list endpoints
```

**With body:**
```
feat(export): add CSV export for reports

Users can now export their reports as CSV files.
Includes all visible columns and respects current filters.

Closes #234
```

### fix - Bug Fixes

```
fix(auth): prevent session timeout during checkout

fix(form): validate email before submission

fix(api): handle empty array in response

fix(ui): correct button alignment on mobile

fix(date): use UTC for timestamp comparison
```

**With body:**
```
fix(cart): prevent duplicate items on rapid clicks

When users clicked "Add to Cart" multiple times quickly,
duplicate items were added. Now uses debouncing and
optimistic locking to prevent this.

Fixes #456
```

### refactor - Code Improvements

```
refactor(auth): extract token validation to middleware

refactor(api): consolidate error handling

refactor(utils): replace lodash with native methods

refactor(tests): use shared fixtures

refactor(types): add strict null checks
```

**With body:**
```
refactor(user): split User model into domain and persistence

Separates business logic from database concerns following
clean architecture principles. User entity now has no
knowledge of Prisma or database schemas.

No functional changes.
```

### docs - Documentation

```
docs(readme): add quick start guide

docs(api): document rate limiting behavior

docs(contributing): add PR checklist

docs(changelog): update for v2.1.0

docs(components): add Storybook examples
```

### test - Testing

```
test(auth): add integration tests for OAuth flow

test(cart): cover edge cases for discounts

test(api): add contract tests for user endpoint

test(e2e): add checkout flow coverage

test(unit): increase coverage for utils
```

### chore - Maintenance

```
chore(deps): upgrade react to 18.2

chore(ci): add caching for faster builds

chore(lint): enforce import sorting

chore(release): bump version to 2.1.0

chore(docker): optimize image size
```

### perf - Performance

```
perf(api): add response caching

perf(images): implement lazy loading

perf(db): add index for user lookup

perf(bundle): enable tree shaking

perf(render): memoize expensive calculations
```

---

## By Scenario

### Bug Fix from Issue

```
fix(checkout): calculate tax after discount

Previously tax was calculated on the original price,
then discount was applied, resulting in users being
overcharged on tax.

Now: discount applied first, then tax calculated.

Fixes #789
```

### Feature with Migration

```
feat(user): add profile avatar support

- Add avatar_url column to users table
- Create /api/users/avatar upload endpoint
- Display avatar in header and profile page

Migration: 20240115_add_user_avatar.sql
```

### Security Fix

```
fix(auth)!: enforce password complexity requirements

BREAKING CHANGE: Existing passwords that don't meet
new requirements will need to be reset.

New requirements:
- Minimum 12 characters
- At least one uppercase, lowercase, number, symbol

Security: VULN-2024-001
```

### Dependency Update

```
chore(deps): upgrade axios 0.x to 1.x

BREAKING CHANGE: Request interceptors now receive
the full config object instead of just headers.

Updated all interceptors to match new API.
See migration guide: https://axios-http.com/docs/migration
```

### Revert

```
revert: feat(cart): add wishlist feature

This reverts commit abc123.

Wishlist feature caused performance issues
on the product listing page. Reverting while
we investigate the root cause.

Issue: #321
```

---

## Multi-Commit Feature

When implementing a larger feature, split into logical commits:

```bash
# 1. Data layer
git commit -m "feat(db): add comments table schema"

# 2. API
git commit -m "feat(api): add CRUD endpoints for comments"

# 3. UI
git commit -m "feat(ui): add comment component"

# 4. Integration
git commit -m "feat(posts): integrate comments into post view"

# 5. Tests
git commit -m "test(comments): add integration tests"
```

---

## What NOT to Write

### Too Vague

```
# Bad
update code
fix bug
changes
stuff

# Good
fix(auth): handle expired token refresh
```

### Too Technical (No Context)

```
# Bad
fix: change line 42 of user.ts

# Good
fix(user): prevent duplicate email registration
```

### Past Tense

```
# Bad
added new feature
fixed the bug

# Good (imperative)
add new feature
fix the bug
```

### Including "How"

```
# Bad
feat: add login by creating LoginForm component and calling authService

# Good
feat(auth): add login form
```

---

## Commit Templates

Save as `.gitmessage` and configure with `git config commit.template .gitmessage`:

```
# <type>(<scope>): <subject>
#
# <body>
#
# <footer>
#
# Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
# Scope: component or area affected (optional)
# Subject: imperative, lowercase, no period, max 50 chars
# Body: explain what and why, not how
# Footer: reference issues, note breaking changes
```
