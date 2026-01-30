---
name: refactoring
description: Refactors code safely with test verification. Use when asked to refactor, restructure, clean up, or improve code organization.
---

# Refactoring Skill

Restructure code safely while preserving behavior.

## Workflow

### 1. Verify Test Coverage

**Before refactoring, ensure tests exist:**

```bash
# Run existing tests
npm test
pytest
go test ./...
```

If no tests cover the code:
1. Write characterization tests first
2. These capture current behavior (even if buggy)
3. Then refactor with confidence

### 2. Understand Current Structure

**Map the code:**
- What are the dependencies?
- Who calls this code?
- What does it depend on?
- What's the data flow?

```bash
# Find usages
grep -r "functionName" --include="*.ts"

# Find dependencies
grep -r "import.*from.*module" --include="*.ts"
```

### 3. Plan the Refactoring

**Identify the target state:**
- What's the problem with current code?
- What's the desired structure?
- What's the smallest step toward that?

**Choose your approach:**

| Situation | Approach |
|-----------|----------|
| Large function | Extract methods |
| Duplicated code | Extract shared function |
| Complex conditionals | Replace with polymorphism |
| Long parameter list | Introduce parameter object |
| Feature envy | Move method to data's class |
| Data clump | Extract class |

### 4. Execute in Small Steps

**The safe refactoring cycle:**

```
1. Make ONE small change
2. Run tests
3. Commit if green
4. Repeat
```

**Never skip steps:**
- Don't combine multiple refactorings
- Don't "fix bugs" while refactoring
- Don't add features while refactoring

### 5. Verify Behavior Preserved

```bash
# Run full test suite
npm test

# Check for regressions
npm run test:e2e

# Manual smoke test if needed
```

## Quick Reference

### Safe Refactorings (Automated)

Most IDEs can do these automatically:

| Refactoring | Shortcut (VS Code) |
|-------------|-------------------|
| Rename | F2 |
| Extract function | Ctrl+Shift+R |
| Extract variable | Ctrl+Shift+R |
| Inline variable | Ctrl+Shift+R |
| Move to file | Drag in explorer |

### Common Patterns

#### Extract Function

```javascript
// Before
function processOrder(order) {
  // validate
  if (!order.items.length) throw new Error('Empty order');
  if (!order.customer) throw new Error('No customer');

  // calculate total
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }

  // apply discount
  if (order.coupon) {
    total *= (1 - order.coupon.discount);
  }

  return { ...order, total };
}

// After
function processOrder(order) {
  validateOrder(order);
  const total = calculateTotal(order);
  return { ...order, total };
}

function validateOrder(order) {
  if (!order.items.length) throw new Error('Empty order');
  if (!order.customer) throw new Error('No customer');
}

function calculateTotal(order) {
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return order.coupon
    ? subtotal * (1 - order.coupon.discount)
    : subtotal;
}
```

#### Replace Conditional with Polymorphism

```javascript
// Before
function getSpeed(vehicle) {
  switch (vehicle.type) {
    case 'car': return vehicle.horsepower * 0.5;
    case 'bike': return vehicle.gears * 5;
    case 'boat': return vehicle.engineSize * 2;
  }
}

// After
class Car {
  getSpeed() { return this.horsepower * 0.5; }
}
class Bike {
  getSpeed() { return this.gears * 5; }
}
class Boat {
  getSpeed() { return this.engineSize * 2; }
}
```

#### Introduce Parameter Object

```javascript
// Before
function createUser(name, email, age, country, role) {
  // ...
}

// After
function createUser({ name, email, age, country, role }) {
  // ...
}

// Or with type
interface CreateUserParams {
  name: string;
  email: string;
  age: number;
  country: string;
  role: string;
}

function createUser(params: CreateUserParams) {
  // ...
}
```

### Code Smells to Address

| Smell | Refactoring |
|-------|-------------|
| Long method | Extract method |
| Large class | Extract class |
| Duplicate code | Extract function |
| Long parameter list | Parameter object |
| Switch statements | Polymorphism |
| Feature envy | Move method |
| Data clump | Extract class |
| Primitive obsession | Value object |
| Comments explaining code | Extract well-named method |

## Anti-Patterns

### Don't:

1. **Refactor and change behavior simultaneously**
   - Refactoring = same behavior, different structure
   - Keep them separate

2. **Make big-bang changes**
   - Small steps with tests passing between each

3. **Refactor without tests**
   - Write characterization tests first

4. **Over-abstract too early**
   - Wait for duplication to appear 3 times

5. **Refactor "just in case"**
   - Refactor for a reason (readability, extensibility needed now)

## See Also

- [patterns.md](./patterns.md) - Detailed refactoring patterns with examples
