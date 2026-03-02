---
name: atlas-execute
description: Execute the current plan (from STATE.md -> PLAN.md) by following the canonical execute command doc. Make code changes + run necessary checks.
---

Read the canonical execute command markdown at `commands/atlas/execute.md` and follow it exactly.

Codex command style:
- Replace any `/atlas:<command>` references from canonical docs with `$atlas:<command>` in Codex responses.

Safety: prefer smallest change-set; keep diffs tight; run tests/linters when applicable.
