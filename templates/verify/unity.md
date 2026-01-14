# Unity Verification

Custom verification workflow for Unity projects.

## Process

For each task verification:

1. **Check for compile errors**:
   - Review Unity console output or Editor.log
   - No new compiler errors or warnings

2. **Run EditMode tests** (if applicable):
   ```bash
   unity -batchmode -runTests -testPlatform EditMode -projectPath . -testResults ./TestResults/editmode.xml
   ```

3. **Run PlayMode tests** (if applicable):
   ```bash
   unity -batchmode -runTests -testPlatform PlayMode -projectPath . -testResults ./TestResults/playmode.xml
   ```

4. **Verify build** (for significant changes):
   ```bash
   unity -batchmode -buildTarget Android -quit -logFile ./build.log
   ```
   Check build.log for errors.

## Success Criteria

- [ ] No compile errors
- [ ] All EditMode tests pass
- [ ] All PlayMode tests pass (if changed play logic)
- [ ] Build succeeds (if changed build-affecting code)

## When to Skip

- Documentation-only changes → Skip all
- Editor scripts only → Skip PlayMode tests
- Minor UI tweaks → Skip build verification

## Hints

The `<verify>` field from the task provides context on what specifically to verify.
Use it to scope the verification appropriately.
