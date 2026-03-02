---
name: verifying
description: Use when about to claim work is complete, fixed, or passing - before committing or creating PRs. Requires running verification commands and confirming output before any success claims.
---

# Verification Before Completion

Evidence before claims, always.

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this message, you cannot claim it passes.

## The Gate Function

```
BEFORE claiming any status:

1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh, complete)
3. READ: Full output, check exit code
4. VERIFY: Does output confirm the claim?
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence
5. ONLY THEN: Make the claim

Skip any step = lying, not verifying
```

## What Requires Verification

| Claim | Requires | Not Sufficient |
|-------|----------|----------------|
| "Tests pass" | Test command output: 0 failures | Previous run, "should pass" |
| "Linter clean" | Linter output: 0 errors | Partial check |
| "Build succeeds" | Build command: exit 0 | Linter passing |
| "Bug fixed" | Test original symptom: passes | Code changed |
| "Feature complete" | Requirements checklist verified | Tests passing |

## Red Flags - STOP

If you catch yourself:
- Using "should", "probably", "seems to"
- About to say "Done!" before verification
- About to commit/push/PR without running tests
- Relying on partial verification
- Thinking "just this once"

**STOP. Run the verification command.**

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Should work now" | RUN the verification |
| "I'm confident" | Confidence ≠ evidence |
| "Just this once" | No exceptions |
| "Linter passed" | Linter ≠ tests |
| "I'm tired" | Exhaustion ≠ excuse |
| "Partial check is enough" | Partial proves nothing |

## Correct Patterns

**Tests:**
```
Run test command → See: 34/34 pass → "All tests pass"

NOT: "Should pass now" / "Looks correct"
```

**Build:**
```
Run build → See: exit 0 → "Build passes"

NOT: "Linter passed" (linter doesn't check compilation)
```

**Bug fix:**
```
Reproduce bug → Apply fix → Test → Bug no longer occurs → "Fixed"

NOT: "Changed the code, should be fixed"
```

**Requirements:**
```
Re-read requirements → Check each → Report gaps or completion

NOT: "Tests pass, must be done"
```

## Verification Commands

```bash
# JavaScript/TypeScript
npm test                    # Run all tests
npm run build              # Verify build
npm run lint               # Check linting

# Python
pytest                     # Run all tests
python -m mypy .          # Type checking
python -m build           # Verify build

# Go
go test ./...             # Run all tests
go build ./...            # Verify build

# General
echo $?                   # Check last exit code (0 = success)
```

## When to Apply

**ALWAYS before:**
- Saying work is complete
- Committing code
- Creating pull requests
- Moving to next task
- Claiming a bug is fixed
- Reporting feature is done

## The Bottom Line

**No shortcuts for verification.**

Run the command. Read the output. THEN claim the result.

This is non-negotiable.
