# AI Workflow (Atlas Commands via Codex Skills)

This repo maps Atlas Claude commands to Codex skills and wrapper scripts.

## Interactive (Codex CLI)

1. Start Codex CLI in repo root.
2. Use `/skills` (or type `$`) to open the skill picker.
3. Choose one of:
- `atlas-init`
- `atlas-plan`
- `atlas-execute`
- `atlas-status`
- `atlas-sync`
- `atlas-triage`
- `atlas-complete`
- `atlas-review`

Global availability option:
- Run `npx claude-atlas --global --with-codex-global` once to install Atlas skills at `~/.codex/skills/atlas-*`.
- Project-local skills in `.agents/skills` can override global skills.

## Fresh Context Scripts

Run from repo root:

```bash
./scripts/atlas-init
./scripts/atlas-plan
./scripts/atlas-execute
./scripts/atlas-status
./scripts/atlas-sync
./scripts/atlas-triage
./scripts/atlas-complete
./scripts/atlas-review
```

Defaults:
- Scripts run `codex exec --ephemeral --profile atlas-<command>`.
- `./scripts/atlas-execute` also passes `--full-auto`.

Optional script env vars:
- `ATLAS_PROFILE=atlas-<command>` to override profile.
- `ATLAS_JSON=1` to emit JSONL events.
- `ATLAS_OUTPUT_LAST_MESSAGE=/path/file.txt` for final answer capture.
- `ATLAS_OUTPUT_SCHEMA=/path/schema.json` for schema-constrained output.

## Project Codex Profiles

- Profiles are defined in `.codex/config.toml`.
- Atlas wrappers use `atlas-<command>` profile names by default.

## Maintainer Sync

- Source of truth: `commands/atlas/manifest.json`
- Re-generate wrappers/docs/plugin command list: `node scripts/sync-atlas-artifacts.mjs`

## Expected Files and State Flow

1. `.planning/STATE.md` points to the active plan in `.planning/phases/`.
2. Planning updates `.planning/phases/{NN}-PLAN.md` and state status.
3. Execution applies plan tasks, runs verification, and updates state.
4. Completion/review workflows may update summaries and CLAUDE-guidance artifacts.
5. Sync/status workflows read state and report next action/resume point.

## Canonical Command Docs (Source of Truth)

- `commands/atlas/init.md`
- `commands/atlas/plan.md`
- `commands/atlas/execute.md`
- `commands/atlas/status.md`
- `commands/atlas/sync.md`
- `commands/atlas/triage.md`
- `commands/atlas/complete.md`
- `commands/atlas/review.md`
