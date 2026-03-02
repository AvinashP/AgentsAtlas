# Contributing to AgentsAtlas

Thanks for your interest in contributing! Here's how to get started.

## Quick Start

1. Fork the repo and clone your fork
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Run checks: `npm run check:atlas`
5. Commit with a clear message (see [Commit Format](#commit-format))
6. Push and open a PR against `main`

## Branch Protection

`main` is protected. All changes go through pull requests with at least one approving review.

## Commit Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new atlas command
fix: correct task parsing in execute
docs: update installation instructions
chore: update dependencies
```

## What to Contribute

- Bug fixes
- Documentation improvements
- New skills (see `skills/` directory)
- Command improvements (see `commands/atlas/`)
- Tests and validation

## Project Structure

```
commands/atlas/     # Slash command definitions (Markdown)
skills/             # Development skill definitions
templates/          # Project templates
bin/install.js      # npx installer
scripts/            # Build and sync scripts
```

## After Modifying Commands

If you change `commands/atlas/manifest.json`, regenerate artifacts:

```bash
npm run sync:atlas
```

## Code Style

- Plain JavaScript (Node.js >= 16)
- No build step — keep it simple
- No external runtime dependencies

## Questions?

Open an issue — we're happy to help.
