# Atlas Workflow

Use Atlas skills as thin routers to canonical Claude command docs.

## Planning State

- `.planning/STATE.md` tracks current status, active phase, and current plan file.
- `.planning/ROADMAP.md` defines milestones/phases and target outcomes.
- `.planning/phases/{NN}-PLAN.md` stores the active executable phase plan.
- `.planning/phases/{NN}-SUMMARY.md` stores execution outcomes and deviations.

## Skills to Use

- `atlas-init`: Initialize project workflow artifacts.
- `atlas-plan`: Create executable phase plan.
- `atlas-execute`: Execute current plan tasks.
- `atlas-status`: Check project progress.
- `atlas-sync`: Restore context after /clear.
- `atlas-triage`: Pull and triage external issues.
- `atlas-complete`: Complete current milestone.
- `atlas-review`: Review code changes.

## Canonical Command Docs

- `commands/atlas/init.md`
- `commands/atlas/plan.md`
- `commands/atlas/execute.md`
- `commands/atlas/status.md`
- `commands/atlas/sync.md`
- `commands/atlas/triage.md`
- `commands/atlas/complete.md`
- `commands/atlas/review.md`

## Sync Workflow Artifacts

- Source of truth: `commands/atlas/manifest.json`
- Re-generate wrappers/docs/plugin command list: `node scripts/sync-atlas-artifacts.mjs`
