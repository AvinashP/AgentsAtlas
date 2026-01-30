# PR Templates

Ready-to-use templates for different types of pull requests.

## Feature Templates

### Simple Feature

```markdown
## Summary
Add [feature name] to enable [user benefit].

## Changes
- [Main change]
- [Supporting change]
- [Tests added]

## Testing
1. [Step to test]
2. [Expected result]
```

### Complex Feature

```markdown
## Summary
Implement [feature] as part of [epic/project].

This enables users to [primary benefit]. Previously, [old behavior or limitation].

## Changes

### Backend
- Add [endpoint/service]
- Update [data model]

### Frontend
- Add [component]
- Update [existing views]

### Other
- Add migrations
- Update documentation

## Testing

### Manual Testing
1. [Step 1]
2. [Step 2]
3. [Expected outcome]

### Automated Tests
- Unit tests: `npm test src/features/[feature]`
- Integration: `npm run test:integration`

## Screenshots
| Before | After |
|--------|-------|
| [img]  | [img] |

## Rollback Plan
If issues arise, revert this PR and run migration rollback:
```
[rollback command]
```

## Checklist
- [ ] Feature flag added (if applicable)
- [ ] Analytics events added
- [ ] Documentation updated
- [ ] Backwards compatible
```

---

## Bug Fix Templates

### Simple Bug Fix

```markdown
## Summary
Fix [bug] that caused [symptom].

## Root Cause
[One sentence explanation]

## Solution
[How this fixes it]

## Testing
- Before: [reproduce bug]
- After: [verify fix]

Fixes #[number]
```

### Critical Bug Fix

```markdown
## Summary
**URGENT**: Fix [critical bug] affecting [scope of impact].

## Impact
- [Number] users affected
- [Symptom they're experiencing]
- Started: [when]

## Root Cause
[Detailed explanation of what went wrong]

## Solution
[What this PR does to fix it]

## Testing
1. [Reproduce original issue]
2. [Verify fix works]
3. [Check for regressions]

## Deployment Notes
- [ ] Can be deployed immediately
- [ ] Requires [dependency]
- [ ] Notify [team/channel] after deploy

## Post-Mortem
[Link to incident doc or note to create one]

Fixes #[number]
```

---

## Refactoring Templates

### Code Cleanup

```markdown
## Summary
Refactor [area] for improved [readability/maintainability/performance].

## Motivation
The current implementation [problem statement].

## Changes
- [Change 1 with rationale]
- [Change 2 with rationale]

## Verification
- [ ] All tests pass (no changes needed)
- [ ] No behavioral changes
- [ ] Performance benchmarks unchanged

No user-facing changes.
```

### Architecture Change

```markdown
## Summary
Restructure [module] to follow [pattern/principle].

## Background
Currently, [description of problem with current architecture].

This causes:
- [Pain point 1]
- [Pain point 2]

## New Structure
```
Before:
src/
  oldstructure/

After:
src/
  newstructure/
```

## Migration
- [File moves]
- [Import updates]
- [Deprecation notes]

## Risks
- [Risk 1] - Mitigated by [approach]
- [Risk 2] - Mitigated by [approach]

## Verification
- [ ] All tests pass
- [ ] Imports resolve correctly
- [ ] IDE navigation works
```

---

## Dependency Update Templates

### Minor Update

```markdown
## Summary
Update [package] from [old] to [new].

## Changelog
[Link to changelog or key changes]

## Testing
- [ ] Build passes
- [ ] Tests pass
- [ ] Smoke test in dev
```

### Major Update (Breaking Changes)

```markdown
## Summary
Upgrade [package] from [old] to [new] (major version).

## Breaking Changes
- [Breaking change 1]
- [Breaking change 2]

## Migration Steps Taken
1. [Update X to match new API]
2. [Remove deprecated Y]
3. [Add new required Z]

## Changelog
[Link to changelog]

## Testing
- [ ] All tests updated and passing
- [ ] Manual verification of [affected feature]
- [ ] Performance check (no regression)

## Rollback
If issues found, revert this PR. No database changes.
```

---

## Documentation Templates

### New Documentation

```markdown
## Summary
Add documentation for [topic].

## Content Added
- [Doc 1]: [What it covers]
- [Doc 2]: [What it covers]

## Audience
This documentation is for [developers/users/admins].

## Review Focus
- [ ] Technical accuracy
- [ ] Clarity and completeness
- [ ] Code examples work
```

### API Documentation

```markdown
## Summary
Document [API endpoint/module].

## Endpoints Documented
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/x   | GET    | [description] |
| /api/y   | POST   | [description] |

## Includes
- [ ] Request/response examples
- [ ] Error codes
- [ ] Authentication requirements
- [ ] Rate limiting info
```

---

## CI/Infrastructure Templates

### CI Configuration

```markdown
## Summary
Update CI to [improvement].

## Changes
- [Change to workflow]
- [New step/job added]

## Impact
- Build time: [faster/same/slower by X%]
- Coverage: [change if any]

## Testing
- [x] CI passes on this PR
- [ ] Verified [specific scenario]
```

### Infrastructure Change

```markdown
## Summary
Update [infrastructure component] configuration.

## Changes
- [Specific change]

## Environment Impact
| Environment | Change |
|-------------|--------|
| Dev         | [impact] |
| Staging     | [impact] |
| Production  | [impact] |

## Rollback
[How to rollback if needed]

## Monitoring
After deploy, watch:
- [Metric 1]
- [Metric 2]
```

---

## Draft/WIP Template

```markdown
## 🚧 Work in Progress

**Do not merge** - seeking early feedback.

## Goal
[What this PR will accomplish when complete]

## Current State
- [x] [Completed task]
- [ ] [Remaining task]
- [ ] [Remaining task]

## Questions for Reviewers
1. [Question about approach]
2. [Question about implementation]

## Known Issues
- [ ] [Issue to fix before merge]
```
