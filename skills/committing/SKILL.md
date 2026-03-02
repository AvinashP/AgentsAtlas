---
name: committing
description: Creates quality git commits with conventional commit format. Use when asked to commit changes or create a commit message.
---

# Committing Skill

Create meaningful, conventional commits that tell the story of your changes.

## Workflow

### 1. Analyze Staged Changes

```bash
# See what's staged
git diff --staged --stat

# See detailed changes
git diff --staged
```

**Understand the changes:**
- What files changed?
- What's the nature of the change?
- Is this one logical change or multiple?

### 2. Determine Commit Type

| Type | When to Use |
|------|-------------|
| `feat` | New feature for users |
| `fix` | Bug fix for users |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change, no feature/fix |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `build` | Build system, dependencies |
| `ci` | CI configuration |
| `chore` | Maintenance, tooling |

### 3. Extract Scope (Optional)

Scope identifies the area of the codebase:

```
feat(auth): add password reset flow
fix(api): handle null response
refactor(cart): extract price calculation
```

**Common scopes:**
- Component/module name: `auth`, `cart`, `user`
- Layer: `api`, `ui`, `db`
- Feature area: `checkout`, `search`, `settings`

### 4. Write the Message

**Format:**
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Description rules:**
- Imperative mood: "add" not "added" or "adds"
- Lowercase first letter
- No period at end
- Max 50 characters for subject line
- Explain what and why, not how

### 5. Verify and Commit

```bash
# One more look
git diff --staged

# Commit
git commit -m "type(scope): description"

# Or with body
git commit -m "type(scope): description

More detailed explanation if needed.
Explain why this change was made."
```

## Quick Reference

### Good Commit Messages

```
feat(auth): add two-factor authentication

fix(api): prevent null pointer on empty response

refactor(user): extract validation to separate module

docs(readme): add installation instructions

test(cart): add edge cases for discount calculation

chore(deps): upgrade react to 18.2
```

### Bad Commit Messages

```
# Too vague
fixed stuff
updates
WIP

# Not imperative
added new feature
fixing bug

# Too long/detailed in subject
feat: add new user authentication system with support for OAuth, SAML, and password-based auth
```

### Commit Scope Detection

Based on changed files:

| File Path | Suggested Scope |
|-----------|-----------------|
| `src/auth/*` | `auth` |
| `src/components/Button/*` | `button` or `ui` |
| `src/api/*` | `api` |
| `tests/*` | usually none |
| `package.json` | `deps` |
| `*.md` | `docs` |

## Breaking Changes

For breaking changes, add `!` after type/scope:

```
feat(api)!: change response format

BREAKING CHANGE: Response now returns { data, meta } instead of raw data.
```

## Multiple Changes

**Split into multiple commits when:**
- Changes are logically separate
- Different types (fix AND feat)
- Could be reverted independently

**Keep together when:**
- Changes are related to same feature
- One change requires the other
- Tests for the feature being added

```bash
# Stage selectively
git add -p  # interactive staging
git add src/feature.ts
git commit -m "feat: add feature"

git add tests/feature.test.ts
git commit -m "test: add tests for feature"
```

## See Also

- [examples.md](./examples.md) - More commit message examples by scenario
