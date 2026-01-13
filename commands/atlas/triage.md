---
description: Pull and triage issues from external sources (Sentry, GitHub, etc.)
allowed-tools: Read, Write, Edit, Glob, AskUserQuestion, WebFetch, Bash(curl:*), Bash(gh:*)
---

# Triage Issues

Pull issues from external sources and triage them for planning.

## Process

1. **Ask for source** using AskUserQuestion:
   - Sentry (project URL or paste exceptions)
   - GitHub Issues (repo - uses `gh` CLI)
   - Manual input (paste list)

2. **Fetch issues**:
   - **Sentry**: Use WebFetch with Sentry API or ask user to paste recent exceptions
   - **GitHub**: Run `gh issue list --repo {repo} --state open`
   - **Manual**: Accept pasted text, parse into list

3. **Display issues** in table format:
   ```
   | # | Issue | Severity | Frequency | Source |
   |---|-------|----------|-----------|--------|
   | 1 | NullRef in UserService | high | 234/day | Sentry |
   | 2 | Auth timeout on mobile | medium | 45/day | Sentry |
   | 3 | Dashboard slow load | low | 12/day | GitHub |
   ```

4. **Triage** using AskUserQuestion (multi-select):
   - Which issues to fix now?
   - Which to defer?
   - Which to ignore/close?

5. **Update STATE.md**:
   - Add selected issues to "Deferred Issues" section
   - Tag with severity: `[critical]`, `[major]`, `[minor]`
   - Example:
     ```markdown
     ## Deferred Issues
     - [ ] [critical] NullRef in UserService - 234/day, from Sentry
     - [ ] [major] Auth timeout on mobile - 45/day, from Sentry
     ```

6. **Output**:
   ```
   Triaged {N} issues:
   - {X} selected for fixing
   - {Y} deferred
   - {Z} ignored

   High priority issues added to STATE.md.

   Next: Run /atlas:plan to create fix plan.
   ```

## Sentry Integration

### Parameters
When Sentry is selected, ask using AskUserQuestion:

1. **Version** (optional):
   - Options: "All versions", "Latest release", "Specific version (enter)"
   - Default: Ask user
   - Maps to Sentry query: `release:{version}`

2. **Duration**:
   - Options: "Last 24 hours", "Last 7 days", "Last 30 days"
   - Default: "Last 24 hours"
   - Maps to Sentry query: `firstSeen:-24h` / `-7d` / `-30d`

### Fetch Process
1. Check for `SENTRY_AUTH_TOKEN` environment variable (or ask user)
2. Fetch issues with filters:
   ```
   GET /api/0/projects/{org}/{project}/issues/
   ?query=is:unresolved release:{version}
   &statsPeriod={duration}
   &sort=freq
   ```
3. Sort by frequency/users affected
4. Present top 10-20 for triage

### Example Output
```
Sentry Issues (v2.3.1, last 24h):
| # | Issue | Events | Users | First Seen |
|---|-------|--------|-------|------------|
| 1 | NullRef in UserService | 234 | 89 | 2h ago |
| 2 | Auth timeout on mobile | 45 | 23 | 6h ago |
```

## GitHub Integration

Uses `gh` CLI (must be authenticated):
```bash
gh issue list --repo owner/repo --state open --limit 20
```

## Manual Input

Accept pasted text in any format:
- Bullet list
- Numbered list
- Stack traces
- Error messages

Parse and present for triage.

## Rules
- Don't fetch more than 20-30 issues at once
- Always show severity/frequency when available
- Critical issues should be flagged prominently
- Deferred issues go to STATE.md, not a separate file
