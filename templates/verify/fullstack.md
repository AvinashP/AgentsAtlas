# Full-Stack Verification

Custom verification workflow for Node.js/TypeScript full-stack projects.

## Process

For each task verification:

1. **Type checking**:
   ```bash
   npm run typecheck
   # or: npx tsc --noEmit
   ```

2. **Linting** (if configured):
   ```bash
   npm run lint
   ```

3. **Unit tests**:
   ```bash
   npm test
   # or: npm run test:unit
   ```

4. **API/Integration tests** (if applicable):
   ```bash
   npm run test:api
   # or: npm run test:integration
   ```

5. **Build verification**:
   ```bash
   npm run build
   ```

## Success Criteria

- [ ] No TypeScript errors
- [ ] Linting passes (no new errors)
- [ ] All unit tests pass
- [ ] API tests pass (if changed API code)
- [ ] Build succeeds

## When to Skip

- Config-only changes → Skip tests, run build only
- Test file changes → Run only affected test suite
- Documentation → Skip all

## E2E Tests (Optional)

For UI-affecting changes, consider:
```bash
npm run test:e2e
# or: npx playwright test
# or: npx cypress run
```

## Hints

The `<verify>` field from the task provides context on what specifically to verify.
Use it to scope the verification appropriately.
