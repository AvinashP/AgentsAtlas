# Debugging Strategies

Detailed strategies organized by error type and situation.

## By Error Category

### TypeError / Null Reference

**Symptoms:** `Cannot read property 'x' of undefined`, `null is not an object`

**Strategy:**
1. Find where the null/undefined originates (not where it fails)
2. Trace data flow backwards from error
3. Check: API responses, default values, async timing

**Common causes:**
- Async data not loaded yet (component renders before fetch completes)
- Optional chaining needed (`obj?.prop` instead of `obj.prop`)
- Wrong assumptions about data shape
- Renamed/removed properties

**Fix patterns:**
```javascript
// Before: assumes data exists
const name = user.profile.name;

// After: handle missing data
const name = user?.profile?.name ?? 'Unknown';

// Or: guard clause
if (!user?.profile) {
  return <Loading />;
}
```

---

### Import / Module Errors

**Symptoms:** `Module not found`, `Cannot find module`, `is not exported`

**Strategy:**
1. Verify the file exists at the specified path
2. Check for typos in path and export name
3. Look for circular dependencies
4. Verify package is installed

**Common causes:**
- Case sensitivity (works on Mac, fails on Linux)
- Missing file extension in some bundlers
- Default vs named export mismatch
- Circular imports

**Fix patterns:**
```javascript
// Named export mismatch
// File exports: export const helper = ...
// Wrong: import helper from './utils'
// Right: import { helper } from './utils'

// Check for circular deps
// A imports B, B imports A → refactor to C
```

---

### Network / API Errors

**Symptoms:** `CORS error`, `401 Unauthorized`, `timeout`, `NetworkError`

**Strategy:**
1. Check Network tab in DevTools
2. Compare request vs expected (headers, body, URL)
3. Test API directly with curl/Postman
4. Check backend logs

**Common causes:**
- CORS not configured for frontend origin
- Missing/expired auth token
- Wrong environment URL
- Request body format mismatch

**Fix patterns:**
```javascript
// Check request before sending
console.log('Request:', { url, method, headers, body });

// Handle all error cases
try {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`${res.status}: ${error}`);
  }
  return res.json();
} catch (e) {
  console.error('Fetch failed:', e);
  throw e;
}
```

---

### Build / Compilation Errors

**Symptoms:** Build fails, type errors, bundler errors

**Strategy:**
1. Read the FULL error message (often includes fix suggestions)
2. Check if it's a real error or config issue
3. Verify all dependencies are installed
4. Check for version mismatches

**Common causes:**
- TypeScript strict mode catching real issues
- Missing types (`@types/` packages)
- Dependency version conflicts
- Config file syntax errors

**Fix patterns:**
```bash
# Clear caches and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for version conflicts
npm ls <package-name>

# Update TypeScript for new features
npx tsc --version
```

---

### State / Data Flow Errors

**Symptoms:** UI shows wrong data, updates don't reflect, stale state

**Strategy:**
1. Log state at key points
2. Check if state updates are immutable
3. Verify effect dependencies
4. Check for closure over stale values

**Common causes:**
- Mutating state directly instead of creating new object
- Missing effect dependencies
- Closure capturing old state value
- Race conditions between updates

**Fix patterns:**
```javascript
// Wrong: mutating state
state.items.push(newItem);
setState(state);

// Right: immutable update
setState(prev => ({
  ...prev,
  items: [...prev.items, newItem]
}));

// Wrong: stale closure
useEffect(() => {
  setInterval(() => console.log(count), 1000);
}, []); // count never updates

// Right: use ref or include dep
const countRef = useRef(count);
countRef.current = count;
useEffect(() => {
  setInterval(() => console.log(countRef.current), 1000);
}, []);
```

---

## By Situation

### Works Locally, Fails in CI/Production

**Strategy:**
1. Compare environments systematically
2. Check: env vars, versions, file system, permissions

**Checklist:**
- [ ] Node/Python/runtime version matches?
- [ ] All env vars set in CI?
- [ ] File paths case-sensitive (Linux vs Mac)?
- [ ] Write permissions for cache/temp dirs?
- [ ] Network access to external services?
- [ ] Secrets/credentials configured?

---

### Intermittent / Flaky Failures

**Strategy:**
1. Look for timing/race conditions
2. Check external dependencies (APIs, DBs)
3. Look for shared mutable state

**Checklist:**
- [ ] Tests depending on timing (`setTimeout`)?
- [ ] Shared state between tests?
- [ ] External API rate limits?
- [ ] Resource cleanup between runs?
- [ ] Order-dependent tests?

**Fix:** Add proper waits, isolate tests, mock externals

---

### Regression (Worked Before)

**Strategy:**
1. Find the last known working state
2. Use git bisect to find breaking commit
3. Review the breaking change

**Commands:**
```bash
git bisect start
git bisect bad HEAD
git bisect good v1.2.3  # or commit hash

# Git will checkout commits for you to test
# Mark each as good or bad
git bisect good  # or
git bisect bad

# When found:
git bisect reset
git show <breaking-commit>
```

---

### Memory Leak / Performance

**Strategy:**
1. Profile before optimizing
2. Look for unbounded growth
3. Check cleanup/disposal

**Common causes:**
- Event listeners not removed
- Intervals/timeouts not cleared
- Subscriptions not unsubscribed
- Growing caches without eviction
- Closures holding large objects

**Tools:**
- Chrome DevTools Memory tab
- Node.js `--inspect` with Chrome DevTools
- `heapdump` package for Node.js
