---
name: debugging
description: Use when encountering any bug, test failure, error, or unexpected behavior - before proposing fixes. Requires root cause investigation first.
---

# Systematic Debugging

Diagnose and fix errors using scientific method with disciplined root cause analysis.

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot propose fixes. Symptom fixes are failure.

## When to Use

**Use for ANY technical issue:**
- Test failures
- Bugs in production
- Unexpected behavior
- "It doesn't work" problems
- Build/compilation failures
- Performance problems

**Use ESPECIALLY when:**
- Under time pressure (emergencies make guessing tempting)
- "Just one quick fix" seems obvious
- You've already tried multiple fixes
- Previous fix didn't work

**Don't skip when:**
- Issue seems simple (simple bugs have root causes too)
- You're in a hurry (systematic is faster than thrashing)

## The Four Phases

Complete each phase before proceeding to the next.

### Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

#### 1. Read Error Messages Carefully
- Don't skip past errors or warnings
- They often contain the exact solution
- Read stack traces completely
- Note line numbers, file paths, error codes

#### 2. Reproduce Consistently
- Can you trigger it reliably?
- What are the exact steps?
- Does it happen every time?
- If not reproducible → gather more data, don't guess

#### 3. Check Recent Changes
- What changed that could cause this?
- `git diff`, recent commits
- New dependencies, config changes
- Environmental differences

#### 4. Trace Data Flow
When error is deep in call stack:
- Where does the bad value originate?
- What called this with the bad value?
- Keep tracing up until you find the source
- **Fix at source, not at symptom**

See [root-cause-tracing.md](./root-cause-tracing.md) for the complete backward tracing technique.

#### 5. Gather Evidence in Multi-Component Systems
When system has multiple components (API → service → database):

```
For EACH component boundary:
  - Log what data enters component
  - Log what data exits component
  - Verify environment/config propagation

Run once to gather evidence showing WHERE it breaks
THEN analyze evidence to identify failing component
THEN investigate that specific component
```

### Phase 2: Pattern Analysis

**Find the pattern before fixing:**

1. **Find Working Examples** - Locate similar working code in same codebase
2. **Compare Against References** - Read reference implementation COMPLETELY, don't skim
3. **Identify Differences** - List every difference between working and broken
4. **Understand Dependencies** - What settings, config, environment does it need?

### Phase 3: Hypothesis and Testing

**Scientific method:**

1. **Form Single Hypothesis** - State clearly: "I think X is the root cause because Y"
2. **Test Minimally** - Make the SMALLEST possible change to test hypothesis
3. **One Variable at a Time** - Don't fix multiple things at once
4. **Verify Before Continuing**
   - Did it work? → Phase 4
   - Didn't work? → Form NEW hypothesis, don't add more fixes

### Phase 4: Implementation

**Fix the root cause, not the symptom:**

1. **Create Failing Test Case** - Simplest possible reproduction, automated if possible
2. **Implement Single Fix** - ONE change at a time, no "while I'm here" improvements
3. **Verify Fix** - Test passes? No other tests broken? Issue actually resolved?
4. **If Fix Doesn't Work** - STOP. If ≥3 fixes failed, question the architecture

## Red Flags - STOP and Return to Phase 1

If you catch yourself thinking:
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Add multiple changes, run tests"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- Proposing solutions before tracing data flow
- "One more fix attempt" (when already tried 2+)

**ALL of these mean: STOP. Return to Phase 1.**

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Issue is simple, don't need process" | Simple issues have root causes too. Process is fast for simple bugs. |
| "Emergency, no time for process" | Systematic debugging is FASTER than guess-and-check thrashing. |
| "Just try this first, then investigate" | First fix sets the pattern. Do it right from the start. |
| "Multiple fixes at once saves time" | Can't isolate what worked. Causes new bugs. |
| "I see the problem, let me fix it" | Seeing symptoms ≠ understanding root cause. |

## Quick Reference

| Phase | Key Activities | Success Criteria |
|-------|---------------|------------------|
| **1. Root Cause** | Read errors, reproduce, check changes, trace data | Understand WHAT and WHY |
| **2. Pattern** | Find working examples, compare | Identify differences |
| **3. Hypothesis** | Form theory, test minimally | Confirmed or new hypothesis |
| **4. Implementation** | Create test, fix, verify | Bug resolved, tests pass |

## Debugging Commands

```bash
# Git bisect for regressions
git bisect start
git bisect bad HEAD
git bisect good <last-known-good-commit>

# Find recent changes to a file
git log --oneline -10 path/to/file

# Search for error message
grep -r "error message" --include="*.ts"
```

## Common Fixes by Error Type

| Error Pattern | Likely Root Cause | Investigation |
|---------------|------------------|---------------|
| `Cannot read property 'x' of undefined` | Missing data, async timing | Trace where null originates |
| `Module not found` | Path issues, missing export | Check exact path, case sensitivity |
| `CORS error` | Backend config | Check Network tab, test with curl |
| `Timeout` | Slow operation, connection issue | Profile, check network |
| Works locally, fails in CI | Environment diff | Compare env vars, versions, permissions |
| Intermittent failures | Race conditions, timing | Look for shared state, async issues |

## Real-World Impact

From debugging sessions:
- Systematic approach: 15-30 minutes to fix
- Random fixes approach: 2-3 hours of thrashing
- First-time fix rate: 95% vs 40%

## See Also

- [root-cause-tracing.md](./root-cause-tracing.md) - Trace bugs backward to original trigger
- [strategies.md](./strategies.md) - Detailed strategies by error type
- [examples.md](./examples.md) - Real debugging case studies
