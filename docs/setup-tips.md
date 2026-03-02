# Setup Tips

Advanced Claude Code configuration tips that complement the AgentsAtlas workflow.

## Hooks (Auto-format on Edit)

Add to `.claude/settings.local.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "prettier --write \"$CLAUDE_FILE_PATH\" 2>/dev/null || true"
      }
    ]
  }
}
```

## Permissions (Pre-allow Safe Commands)

Pre-allow commands you run frequently:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run:*)",
      "Bash(npx:*)",
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Bash(git log:*)"
    ]
  }
}
```

## Parallel Sessions

For complex projects, run multiple Claude Code sessions:

- **Main terminal**: Atlas workflow (`/atlas:plan` → `/atlas:execute`)
- **Secondary terminals**: Quick fixes, tests, documentation
- **Browser tabs**: Claude.ai for research, explanations

Each session maintains its own context — use Atlas in your primary workflow session.

## @.claude in PR Comments

Enable team-wide CLAUDE.md contributions via GitHub Actions:

```yaml
# .github/workflows/claude-pr.yml
name: Claude PR Assistant
on:
  issue_comment:
    types: [created]

jobs:
  respond:
    if: contains(github.event.comment.body, '@.claude')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Claude
        run: |
          # Your Claude Code invocation here
          # See: https://docs.anthropic.com/en/docs/claude-code
```

This allows teammates to tag `@.claude` in PR comments for automated review suggestions.
