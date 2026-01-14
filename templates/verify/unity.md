# Unity Verification

Custom verification workflow for Unity projects.

## Process

For each task verification:

### 1. Compile Check (Required - Always First)

Open Unity in batch mode to trigger compilation:
```bash
unity -batchmode -projectPath . -logFile ./compile.log -quit
```

Then check `compile.log` for errors:
- Search for `error CS` (C# compiler errors)
- Search for `CompilerError`
- Search for `Cannot build player`

**If compile errors found:**
- Report the specific errors to user
- List file and line number from log
- Do NOT proceed to tests until compile errors are fixed
- Suggest fixes if obvious (missing using, typo, etc.)

### 2. Run EditMode tests (if applicable)
```bash
unity -batchmode -runTests -testPlatform EditMode -projectPath . -testResults ./TestResults/editmode.xml -logFile ./editmode.log
```

Check `editmode.log` and `TestResults/editmode.xml` for failures.

### 3. Run PlayMode tests (if applicable)
```bash
unity -batchmode -runTests -testPlatform PlayMode -projectPath . -testResults ./TestResults/playmode.xml -logFile ./playmode.log
```

Check `playmode.log` and `TestResults/playmode.xml` for failures.

## Success Criteria

- [ ] No compile errors in compile.log
- [ ] All EditMode tests pass
- [ ] All PlayMode tests pass (if changed play logic)

## Error Patterns to Detect

```
error CS0103: The name 'X' does not exist
error CS0246: The type or namespace 'X' could not be found
error CS1061: 'X' does not contain a definition for 'Y'
error CS0029: Cannot implicitly convert type 'X' to 'Y'
CompilerError: ...
```

## When to Skip Tests (but never skip compile check)

- Documentation-only changes → Skip tests
- Editor scripts only → Skip PlayMode tests
- Config/asset changes → Skip tests

## Hints

The `<verify>` field from the task provides context on what specifically to verify.
Use it to scope the verification appropriately.

**Note:** Unity must be closed before running batch mode commands, or use a separate Unity installation path.
