---
description: Pull and triage issues from external sources (Sentry, GitHub, JIRA, etc.)
allowed-tools: Read, Write, Edit, Glob, AskUserQuestion, WebFetch, Bash(curl:*), Bash(gh:*)
---

# Triage Issues

Pull issues from external sources and triage them for planning.

## Credentials

All integrations read credentials from `.env` file in project root:

```bash
# .env (add to .gitignore!)
JIRA_URL=https://yourcompany.atlassian.net
JIRA_EMAIL=you@company.com
JIRA_API_TOKEN=your-jira-api-token

SENTRY_URL=https://sentry.io
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-sentry-token
```

**First run**: If `.env` doesn't exist or is missing required values, ask user and offer to create/update `.env` file.

## Process

1. **Ask for source** using AskUserQuestion:
   - Sentry (project URL or paste exceptions)
   - JIRA (sprint tickets assigned to you)
   - GitHub Issues (repo - uses `gh` CLI)
   - Manual input (paste list)

2. **Fetch issues**:
   - **Sentry**: Use WebFetch with Sentry API or ask user to paste recent exceptions
   - **JIRA**: Use JIRA REST API to fetch sprint tickets
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

4. **Evaluate issues** (per /receiving-feedback skill):
   Before triaging, apply critical evaluation:
   - Is this a real issue or noise? (check frequency, user impact)
   - Is the root cause clear or needs investigation? (per /debugging skill)
   - Is this actionable or too vague?
   - Flag issues that need root cause analysis before planning

5. **Triage** using AskUserQuestion (multi-select):
   - Which issues to fix now?
   - Which to defer?
   - Which need investigation first? (mark for /debugging)
   - Which to ignore/close?

6. **Update STATE.md**:
   - Add selected issues to "Deferred Issues" section
   - Tag with severity: `[critical]`, `[major]`, `[minor]`
   - Tag issues needing investigation: `[needs-debug]`
   - Example:
     ```markdown
     ## Deferred Issues
     - [ ] [critical] NullRef in UserService - 234/day, from Sentry
     - [ ] [major][needs-debug] Auth timeout on mobile - 45/day, from Sentry
     ```

7. **Output**:
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
1. Read `.env` file for `SENTRY_URL`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`
2. If missing, ask user and offer to save to `.env`
3. Fetch issues with filters:
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

## JIRA Integration

### Parameters
When JIRA is selected, ask using AskUserQuestion:

1. **Sprint**:
   - Options: "Current sprint", "Specific sprint (enter)"
   - Default: "Current sprint"

2. **Assignee**:
   - Options: "Me", "Unassigned", "All"
   - Default: "Me"

3. **Status**:
   - Options: "To Do only", "To Do + In Progress", "All open"
   - Default: "To Do only"

### Auth
Read from `.env` file:
- `JIRA_URL` - Your JIRA instance (e.g., `https://company.atlassian.net`)
- `JIRA_EMAIL` - Your JIRA email
- `JIRA_API_TOKEN` - API token from https://id.atlassian.com/manage/api-tokens

If missing, ask user and offer to save to `.env`.

### Fetch Process
```bash
curl -s -u {email}:{token} \
  "{jira_url}/rest/api/3/search?jql=sprint%20in%20openSprints()%20AND%20assignee=currentUser()%20AND%20status%20in%20(%22To%20Do%22)&fields=summary,priority,status,customfield_10016"
```

JQL breakdown:
- `sprint in openSprints()` - Current active sprint
- `assignee=currentUser()` - Assigned to me
- `status in ("To Do")` - Not started yet

### Example Output
```
JIRA Sprint Issues (Sprint 23, assigned to me):
| # | Key | Summary | Priority | Points |
|---|-----|---------|----------|--------|
| 1 | PROJ-123 | Fix login timeout | High | 3 |
| 2 | PROJ-456 | Add dark mode toggle | Medium | 5 |
| 3 | PROJ-789 | Update user profile API | Low | 2 |
```

### Ticket Details
When planning, include JIRA key in task name for traceability:
```xml
<task id="1">
<name>[PROJ-123] Fix login timeout</name>
...
</task>
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
