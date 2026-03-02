# Unity Verification

Custom verification workflow for Unity projects.

## Setup (One-Time)

Add the Atlas compile helper script to your Unity project:

**Create `Assets/Editor/AtlasCompileHelper.cs`:**
```csharp
#if UNITY_EDITOR
using UnityEditor;
using UnityEditor.Compilation;
using UnityEngine;
using System.IO;
using System.Collections.Generic;

[InitializeOnLoad]
public static class AtlasCompileHelper
{
    private static readonly string StatusFile = ".atlas/compile-status.json";
    private static List<string> errors = new List<string>();

    static AtlasCompileHelper()
    {
        CompilationPipeline.compilationStarted += OnCompilationStarted;
        CompilationPipeline.compilationFinished += OnCompilationFinished;
        CompilationPipeline.assemblyCompilationFinished += OnAssemblyCompilationFinished;
    }

    private static void OnCompilationStarted(object context)
    {
        errors.Clear();
        WriteStatus("compiling", null);
    }

    private static void OnAssemblyCompilationFinished(string assembly, CompilerMessage[] messages)
    {
        foreach (var msg in messages)
        {
            if (msg.type == CompilerMessageType.Error)
            {
                errors.Add($"{msg.file}({msg.line}): {msg.message}");
            }
        }
    }

    private static void OnCompilationFinished(object context)
    {
        if (errors.Count > 0)
        {
            WriteStatus("error", errors.ToArray());
        }
        else
        {
            WriteStatus("success", null);
        }
    }

    private static void WriteStatus(string status, string[] errorList)
    {
        var dir = Path.GetDirectoryName(StatusFile);
        if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);

        var json = $@"{{
  ""status"": ""{status}"",
  ""timestamp"": ""{System.DateTime.Now:O}"",
  ""errors"": {(errorList == null ? "[]" : "[\"" + string.Join("\",\"", errorList) + "\"]")}
}}";
        File.WriteAllText(StatusFile, json);
    }

    [MenuItem("Atlas/Trigger Compile Check")]
    public static void TriggerCompileCheck()
    {
        errors.Clear();
        WriteStatus("compiling", null);
        AssetDatabase.Refresh(ImportAssetOptions.ForceUpdate);
    }
}
#endif
```

## Process

For each task verification:

### 1. Trigger Compilation (Unity Editor Open)

**Option A: Via Menu**
- Unity Menu → Atlas → Trigger Compile Check

**Option B: Via Command Line (connects to open Editor)**
```bash
unity -projectPath . -executeMethod AtlasCompileHelper.TriggerCompileCheck -quit
```

**Option C: Touch a file to trigger auto-refresh**
Unity auto-compiles when any .cs file changes. The helper script captures the result.

### 2. Wait and Check Status

Poll `.atlas/compile-status.json` until status is not "compiling":
```json
{
  "status": "success",  // or "error" or "compiling"
  "timestamp": "2024-01-15T10:30:00",
  "errors": []
}
```

**If status is "error":**
- Read the errors array
- Report each error with file and line number
- Attempt to fix if obvious (missing using, typo, etc.)
- Re-trigger compilation after fix
- Do NOT proceed to tests until status is "success"

**If status is "success":**
- Verification succeeded.



## Success Criteria

- [ ] `.atlas/compile-status.json` shows `"status": "success"`


## Fallback: Batch Mode (Unity Closed)

If Unity Editor is not open, use batch mode:
```bash
unity -batchmode -projectPath . -logFile ./compile.log -quit
```

Then check `compile.log` for `error CS` patterns.

## Error Patterns to Detect

```
error CS0103: The name 'X' does not exist
error CS0246: The type or namespace 'X' could not be found
error CS1061: 'X' does not contain a definition for 'Y'
error CS0029: Cannot implicitly convert type 'X' to 'Y'
```

## When to Skip Tests (but never skip compile check)

- Documentation-only changes → Skip tests
- Editor scripts only → Skip PlayMode tests
- Config/asset changes → Skip tests

## Hints

The `<verify>` field from the task provides context on what specifically to verify.
Use it to scope the verification appropriately.
