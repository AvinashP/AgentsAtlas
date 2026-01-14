# Default Verification

Generic verification workflow. Customize for your project.

## Process

For each task verification:

1. **Run the verify command** from the task's `<verify>` field

2. **Check for errors** in output

3. **Verify expected behavior** matches `<done>` criteria

## Success Criteria

- [ ] Verify command exits with code 0
- [ ] No error output
- [ ] Acceptance criteria from `<done>` are met

## Customization

Replace this file with project-specific verification steps:

```markdown
# My Project Verification

## Process
1. Run tests: `your-test-command`
2. Check build: `your-build-command`
3. Verify deployment: `your-deploy-check`

## Success Criteria
- [ ] All tests pass
- [ ] Build succeeds
- [ ] No regressions
```

## Hints

The `<verify>` field from the task provides context on what specifically to verify.
Use it to scope the verification appropriately.
