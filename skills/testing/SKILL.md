---
name: testing
description: Use when implementing any feature or bugfix - before writing implementation code. Write the test first, watch it fail, then implement.
---

# Test-Driven Development

Write the test first. Watch it fail. Write minimal code to pass.

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

If you didn't watch the test fail, you don't know if it tests the right thing.

Write code before the test? **Delete it. Start over.**

## When to Use

**Always:**
- New features
- Bug fixes
- Refactoring
- Behavior changes

**Exceptions (ask first):**
- Throwaway prototypes
- Generated code
- Configuration files

Thinking "skip TDD just this once"? Stop. That's rationalization.

## Red-Green-Refactor

### RED - Write Failing Test

Write one minimal test showing what should happen.

```typescript
// Good: Clear name, tests real behavior, one thing
test('rejects empty email', async () => {
  const result = await submitForm({ email: '' });
  expect(result.error).toBe('Email required');
});
```

```typescript
// Bad: Vague name, tests mock not code
test('form works', async () => {
  const mock = jest.fn().mockResolvedValue('success');
  await submitForm(mock);
  expect(mock).toHaveBeenCalled();
});
```

**Requirements:**
- One behavior per test
- Clear descriptive name
- Real code (no mocks unless unavoidable)

### Verify RED - Watch It Fail

**MANDATORY. Never skip.**

```bash
npm test path/to/test.test.ts
```

Confirm:
- Test **fails** (not errors)
- Failure message is expected
- Fails because feature missing (not typos)

**Test passes?** You're testing existing behavior. Fix the test.

### GREEN - Minimal Code

Write the **simplest** code to pass the test.

```typescript
// Good: Just enough to pass
function validateEmail(email: string): string | null {
  if (!email?.trim()) return 'Email required';
  return null;
}
```

```typescript
// Bad: Over-engineered
function validateEmail(
  email: string,
  options?: {
    allowEmpty?: boolean;
    customRegex?: RegExp;
    onValidate?: (email: string) => void;
  }
): ValidationResult {
  // YAGNI - don't add features not tested
}
```

Don't add features, refactor other code, or "improve" beyond the test.

### Verify GREEN - Watch It Pass

**MANDATORY.**

```bash
npm test path/to/test.test.ts
```

Confirm:
- Test passes
- Other tests still pass
- Output clean (no errors, warnings)

**Test fails?** Fix code, not test.

### REFACTOR - Clean Up

After green only:
- Remove duplication
- Improve names
- Extract helpers

Keep tests green. Don't add behavior.

### Repeat

Next failing test for next feature.

## Red Flags - STOP and Start Over

- Code before test
- Test after implementation
- Test passes immediately (didn't watch it fail)
- Can't explain why test failed
- "I'll test after"
- "Too simple to test"
- "Just this once"
- "Already manually tested it"
- "Keep as reference" (delete means delete)

**All of these mean: Delete code. Start over with TDD.**

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Too simple to test" | Simple code breaks. Test takes 30 seconds. |
| "I'll test after" | Tests passing immediately prove nothing. |
| "Already manually tested" | Ad-hoc ≠ systematic. No record, can't re-run. |
| "Need to explore first" | Fine. Throw away exploration, start with TDD. |
| "Test hard = skip it" | Hard to test = hard to use. Simplify design. |
| "TDD will slow me down" | TDD faster than debugging. |
| "Deleting X hours is wasteful" | Sunk cost fallacy. Keeping unverified code is debt. |

## Why Order Matters

**"I'll write tests after to verify it works"**

Tests written after code pass immediately. Passing immediately proves nothing:
- Might test wrong thing
- Might test implementation, not behavior
- You never saw it catch the bug

Test-first forces you to see the test fail, proving it actually tests something.

## Quick Reference

### Test Types

| Type | Purpose | Dependencies |
|------|---------|--------------|
| Unit | Single function/method | Mock externals |
| Integration | Multiple components | Real dependencies |
| E2E | Full user workflow | Full system |

### What to Test

**Always test:**
- Happy path (normal usage)
- Edge cases (empty, null, boundaries)
- Error handling (invalid input, failures)

**Skip testing:**
- Framework code (React, Express)
- Third-party libraries
- Simple getters/setters

### Verification Checklist

Before marking complete:
- [ ] Every new function has a test
- [ ] Watched each test fail before implementing
- [ ] Each test failed for expected reason
- [ ] Wrote minimal code to pass each test
- [ ] All tests pass
- [ ] Tests use real code (mocks only if unavoidable)

Can't check all boxes? You skipped TDD. Start over.

## Example: Bug Fix with TDD

**Bug:** Empty email accepted

**RED**
```typescript
test('rejects empty email', async () => {
  const result = await submitForm({ email: '' });
  expect(result.error).toBe('Email required');
});
```

**Verify RED**
```bash
$ npm test
FAIL: expected 'Email required', got undefined
```

**GREEN**
```typescript
function submitForm(data: FormData) {
  if (!data.email?.trim()) {
    return { error: 'Email required' };
  }
  // ...
}
```

**Verify GREEN**
```bash
$ npm test
PASS
```

**REFACTOR** - Extract validation if needed.

## When Stuck

| Problem | Solution |
|---------|----------|
| Don't know how to test | Write desired API first. Write assertion first. |
| Test too complicated | Design too complicated. Simplify interface. |
| Must mock everything | Code too coupled. Use dependency injection. |
| Test setup huge | Extract helpers. Still complex? Simplify design. |

## See Also

- [frameworks.md](./frameworks.md) - Framework-specific patterns (Jest, Vitest, Pytest)
- [patterns.md](./patterns.md) - Common test patterns and examples
- [anti-patterns.md](./anti-patterns.md) - Testing mistakes to avoid
