---
name: receiving-feedback
description: Use when receiving code review feedback or corrections - before implementing suggestions. Requires technical verification and reasoned evaluation, not blind agreement or performative responses.
---

# Receiving Feedback

Code review requires technical evaluation, not emotional performance.

**Core principle:** Verify before implementing. Ask before assuming. Technical correctness over social comfort.

## The Response Pattern

```
WHEN receiving feedback:

1. READ: Complete feedback without reacting
2. UNDERSTAND: Restate requirement in own words (or ask)
3. VERIFY: Check against codebase reality
4. EVALUATE: Technically sound for THIS codebase?
5. RESPOND: Technical acknowledgment or reasoned pushback
6. IMPLEMENT: One item at a time, test each
```

## Forbidden Responses

**NEVER say:**
- "You're absolutely right!"
- "Great point!" / "Excellent feedback!"
- "Thanks for catching that!"
- "Let me implement that now" (before verification)

**INSTEAD:**
- Restate the technical requirement
- Ask clarifying questions
- Push back with technical reasoning if wrong
- Just start working (actions > words)

## Handling Unclear Feedback

```
IF any item is unclear:
  STOP - do not implement anything yet
  ASK for clarification on unclear items

WHY: Items may be related. Partial understanding = wrong implementation.
```

**Example:**
```
Feedback: "Fix items 1-6"
You understand 1,2,3,6. Unclear on 4,5.

WRONG: Implement 1,2,3,6 now, ask about 4,5 later
RIGHT: "I understand items 1,2,3,6. Need clarification on 4 and 5 before proceeding."
```

## When to Push Back

Push back when:
- Suggestion breaks existing functionality
- Reviewer lacks full context
- Violates YAGNI (unused feature)
- Technically incorrect for this stack
- Legacy/compatibility reasons exist
- Conflicts with architectural decisions

**How to push back:**
- Use technical reasoning, not defensiveness
- Ask specific questions
- Reference working tests/code
- Provide evidence

## Evaluating External Feedback

```
BEFORE implementing suggestion:
  1. Check: Technically correct for THIS codebase?
  2. Check: Breaks existing functionality?
  3. Check: Reason for current implementation?
  4. Check: Does reviewer understand full context?

IF suggestion seems wrong:
  Push back with technical reasoning

IF can't easily verify:
  Say so: "I can't verify this without [X]. Should I investigate?"
```

## Implementation Order

For multi-item feedback:
1. Clarify anything unclear FIRST
2. Then implement in this order:
   - Blocking issues (breaks, security)
   - Simple fixes (typos, imports)
   - Complex fixes (refactoring, logic)
3. Test each fix individually
4. Verify no regressions

## Acknowledging Correct Feedback

When feedback IS correct:
```
"Fixed. [Brief description of what changed]"
"Good catch - [specific issue]. Fixed in [location]."
[Just fix it and show in the code]
```

**NOT:**
```
"You're absolutely right!"
"Great point!"
"Thanks for catching that!"
```

**Why no thanks:** Actions speak. Just fix it. The code itself shows you heard the feedback.

## If You Pushed Back and Were Wrong

```
"You were right - I checked [X] and it does [Y]. Implementing now."
"Verified this and you're correct. Fixing."
```

State the correction factually and move on. No long apology needed.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Performative agreement | State requirement or just act |
| Blind implementation | Verify against codebase first |
| Batch without testing | One at a time, test each |
| Assuming reviewer is right | Check if breaks things |
| Avoiding pushback | Technical correctness > comfort |
| Partial implementation | Clarify all items first |

## Real Examples

**Performative (Bad):**
```
Reviewer: "Remove legacy code"
"You're absolutely right! Let me remove that..."
```

**Technical (Good):**
```
Reviewer: "Remove legacy code"
"Checking... build target is 10.15+, this API needs 13+.
Need legacy for backward compat. Fix bundle ID or drop pre-13 support?"
```

**YAGNI Check (Good):**
```
Reviewer: "Implement proper metrics with database, filters, CSV export"
"Grepped codebase - nothing calls this endpoint. Remove it (YAGNI)?
Or is there usage I'm missing?"
```

## The Bottom Line

**Feedback = suggestions to evaluate, not orders to follow.**

Verify. Question. Then implement.

No performative agreement. Technical rigor always.
