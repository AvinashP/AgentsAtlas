# Debugging Examples

Real-world debugging case studies demonstrating the systematic approach.

## Example 1: The Mysterious 500 Error

### Symptom
User reports: "The save button doesn't work anymore"

### Gather Context
```
Error: POST /api/users/123 returned 500
Stack trace: None visible in frontend
Recent changes: Deployed new user validation yesterday
Reproduction: Click save on any user profile
```

### Hypotheses
1. **New validation rejecting valid data** (likely - recent deploy)
2. Database connection issue (less likely - other endpoints work)
3. Auth token expired (less likely - user can load data)

### Investigation
```bash
# Check backend logs
grep "POST /api/users" logs/app.log | tail -20

# Found:
# ValidationError: email must be unique
# But user wasn't changing email...
```

### Root Cause
New validation checks email uniqueness, but query includes the current user's own email, causing self-conflict.

### Fix
```javascript
// Before
const existing = await User.findOne({ email });
if (existing) throw new ValidationError('email must be unique');

// After
const existing = await User.findOne({
  email,
  _id: { $ne: userId }  // Exclude current user
});
if (existing) throw new ValidationError('email must be unique');
```

### Lessons
- Always check backend logs for 500 errors
- Test validation with existing records, not just new ones

---

## Example 2: The Flaky Test

### Symptom
CI fails randomly: "Expected 3 items, received 2"

### Gather Context
```
Test: "should display all todos"
Failure rate: ~30% of runs
Local: Always passes
```

### Hypotheses
1. **Race condition** (likely - async + random failures)
2. Test data pollution from other tests
3. CI environment difference

### Investigation
```javascript
// Original test
test('should display all todos', async () => {
  render(<TodoList />);
  await screen.findByText('Todo 1');
  const items = screen.getAllByRole('listitem');
  expect(items).toHaveLength(3);
});
```

Problem: `findByText` waits for first item, but doesn't wait for all items to render.

### Root Cause
Component renders items progressively. Test checks count before all items render.

### Fix
```javascript
// Fixed test
test('should display all todos', async () => {
  render(<TodoList />);
  // Wait for all items explicitly
  await waitFor(() => {
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });
});
```

### Lessons
- `findBy` only waits for ONE element
- Use `waitFor` when checking counts or multiple elements
- If it's flaky in CI, it's a real bug

---

## Example 3: The Infinite Loop

### Symptom
Browser tab freezes when opening settings page

### Gather Context
```
Page: /settings
Behavior: Loads briefly, then freezes
Console: No errors, but thousands of renders
Recent changes: Added user preferences sync
```

### Hypotheses
1. **Effect dependency causing re-render loop** (likely - recent change + infinite renders)
2. Recursive component rendering
3. Infinite data fetching

### Investigation
```javascript
// Suspect code
useEffect(() => {
  setPreferences({ ...defaults, ...userPrefs });
}, [preferences]); // 🔴 preferences in deps!
```

The effect sets `preferences`, which triggers the effect, which sets `preferences`...

### Root Cause
Effect depends on `preferences` but also modifies `preferences`, creating infinite loop.

### Fix
```javascript
// Fixed: only run on userPrefs change
useEffect(() => {
  setPreferences({ ...defaults, ...userPrefs });
}, [userPrefs]); // Only external dependency
```

### Lessons
- Effect dependencies should be inputs, not outputs
- React DevTools Profiler shows excessive renders
- ESLint react-hooks/exhaustive-deps helps catch these

---

## Example 4: Works on My Machine

### Symptom
Feature works in development, 404 in production

### Gather Context
```
Feature: Image upload
Dev: localhost:3000 - works
Prod: app.example.com - 404 on upload endpoint
Both: Same code, same API routes
```

### Hypotheses
1. **API route not deployed** (likely - specific endpoint fails)
2. Proxy/routing misconfiguration
3. Environment variable missing

### Investigation
```bash
# Check if route exists in production build
curl -X POST https://app.example.com/api/upload
# Response: 404

# Check local API routes
ls pages/api/
# upload.ts exists

# Check production logs
# No request reaching the API at all
```

### Root Cause
New API route wasn't included in deployment. CI had caching that excluded new files.

### Fix
```yaml
# Fixed CI config
- name: Build
  run: |
    rm -rf .next  # Clear cache
    npm run build
```

### Lessons
- 404 means route doesn't exist, not permission/auth
- Check if deployment actually includes new files
- CI caching can hide new files

---

## Example 5: The Silent Failure

### Symptom
Form submits but data never saves

### Gather Context
```
Form: Contact form
Behavior: Shows success message, but no data in DB
Network tab: POST returns 200
No errors anywhere
```

### Hypotheses
1. **Success returned before save completes** (likely - 200 but no data)
2. Data saved to wrong table/collection
3. Validation silently rejecting

### Investigation
```javascript
// API endpoint
export default async function handler(req, res) {
  const data = req.body;
  saveContact(data);  // 🔴 Missing await!
  res.json({ success: true });
}
```

### Root Cause
Missing `await` on async save function. Response sent immediately, then Lambda/serverless function terminates before save completes.

### Fix
```javascript
export default async function handler(req, res) {
  const data = req.body;
  await saveContact(data);  // Wait for save
  res.json({ success: true });
}
```

### Lessons
- 200 response doesn't mean operation completed
- Serverless functions terminate after response
- Always `await` async operations before responding

---

## Debugging Checklist

Use this when stuck:

- [ ] Read the FULL error message
- [ ] Check browser console AND backend logs
- [ ] Verify assumptions with logging
- [ ] Compare working vs broken case
- [ ] Check what changed recently
- [ ] Test the simplest reproduction
- [ ] Search codebase for error text
- [ ] Search GitHub issues for error
- [ ] Take a break and explain to rubber duck
