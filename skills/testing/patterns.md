# Test Patterns

Common patterns for writing effective tests.

## Unit Test Patterns

### Arrange-Act-Assert (AAA)

```javascript
it('calculates total with discount', () => {
  // Arrange
  const cart = new ShoppingCart();
  cart.addItem({ price: 100 });
  cart.applyDiscount(10); // 10%

  // Act
  const total = cart.getTotal();

  // Assert
  expect(total).toBe(90);
});
```

### Given-When-Then (BDD)

```javascript
describe('ShoppingCart', () => {
  describe('given a cart with items', () => {
    describe('when a discount is applied', () => {
      it('then total should reflect discount', () => {
        // ...
      });
    });
  });
});
```

---

## Testing Edge Cases

### Boundary Values

```javascript
describe('validateAge', () => {
  // Test boundaries
  it('accepts minimum age (18)', () => {
    expect(validateAge(18)).toBe(true);
  });

  it('rejects below minimum (17)', () => {
    expect(validateAge(17)).toBe(false);
  });

  it('accepts maximum age (120)', () => {
    expect(validateAge(120)).toBe(true);
  });

  it('rejects above maximum (121)', () => {
    expect(validateAge(121)).toBe(false);
  });
});
```

### Empty/Null/Undefined

```javascript
describe('processArray', () => {
  it('handles empty array', () => {
    expect(processArray([])).toEqual([]);
  });

  it('handles null', () => {
    expect(processArray(null)).toEqual([]);
  });

  it('handles undefined', () => {
    expect(processArray(undefined)).toEqual([]);
  });
});
```

### Special Characters

```javascript
describe('sanitizeInput', () => {
  it.each([
    ['<script>alert("xss")</script>', ''],
    ['Hello & World', 'Hello &amp; World'],
    ['Quote: "test"', 'Quote: &quot;test&quot;'],
    ['   spaces   ', 'spaces'],
  ])('sanitizes %s to %s', (input, expected) => {
    expect(sanitizeInput(input)).toBe(expected);
  });
});
```

---

## Async Testing Patterns

### Promise Resolution

```javascript
it('resolves with data', async () => {
  const result = await fetchUser(123);
  expect(result.name).toBe('John');
});

it('rejects on error', async () => {
  await expect(fetchUser('invalid')).rejects.toThrow('User not found');
});
```

### Waiting for State Changes

```javascript
it('updates after async operation', async () => {
  render(<UserProfile />);

  // Wait for specific element
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  // Or use findBy (combines getBy + waitFor)
  const element = await screen.findByText('John Doe');
  expect(element).toBeInTheDocument();
});
```

### Testing Debounced Functions

```javascript
it('debounces search input', async () => {
  jest.useFakeTimers();
  const onSearch = jest.fn();
  render(<SearchInput onSearch={onSearch} debounce={300} />);

  // Type quickly
  await userEvent.type(screen.getByRole('textbox'), 'test');

  // Not called yet
  expect(onSearch).not.toHaveBeenCalled();

  // Advance timers
  jest.advanceTimersByTime(300);

  // Now called once with final value
  expect(onSearch).toHaveBeenCalledTimes(1);
  expect(onSearch).toHaveBeenCalledWith('test');
});
```

---

## Mocking Patterns

### Mock Return Values

```javascript
// Single value
mockFn.mockReturnValue('result');

// Different values per call
mockFn
  .mockReturnValueOnce('first')
  .mockReturnValueOnce('second')
  .mockReturnValue('default');

// Async
mockFn.mockResolvedValue({ data: 'test' });
mockFn.mockRejectedValue(new Error('Failed'));
```

### Mock Implementations

```javascript
// Custom logic
mockFn.mockImplementation((id) => {
  if (id === 'special') return { special: true };
  return { id };
});

// Capture arguments
const calls = [];
mockFn.mockImplementation((...args) => {
  calls.push(args);
  return 'mocked';
});
```

### Partial Mocks

```javascript
// Mock some methods, keep others real
jest.mock('./userService', () => {
  const actual = jest.requireActual('./userService');
  return {
    ...actual,
    fetchUser: jest.fn(), // only mock this
  };
});
```

---

## Test Data Patterns

### Factories

```javascript
// userFactory.js
export function createUser(overrides = {}) {
  return {
    id: Math.random().toString(36),
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    createdAt: new Date(),
    ...overrides,
  };
}

// In tests
const admin = createUser({ role: 'admin' });
const customUser = createUser({ name: 'John', email: 'john@test.com' });
```

### Builders

```javascript
class UserBuilder {
  constructor() {
    this.user = { name: 'Default', role: 'user' };
  }

  withName(name) {
    this.user.name = name;
    return this;
  }

  asAdmin() {
    this.user.role = 'admin';
    return this;
  }

  build() {
    return { ...this.user };
  }
}

// Usage
const admin = new UserBuilder().withName('Alice').asAdmin().build();
```

### Fixtures

```javascript
// fixtures/users.json
{
  "validUser": { "id": "1", "name": "Valid User" },
  "adminUser": { "id": "2", "name": "Admin", "role": "admin" },
  "invalidUser": { "id": "", "name": "" }
}

// In tests
import fixtures from './fixtures/users.json';
const user = fixtures.validUser;
```

---

## Integration Test Patterns

### Database Tests

```javascript
describe('UserRepository', () => {
  let db;

  beforeAll(async () => {
    db = await connectTestDatabase();
  });

  afterAll(async () => {
    await db.close();
  });

  beforeEach(async () => {
    await db.clear(); // Reset between tests
  });

  it('saves and retrieves user', async () => {
    const repo = new UserRepository(db);
    const user = { name: 'Test', email: 'test@test.com' };

    const saved = await repo.create(user);
    const retrieved = await repo.findById(saved.id);

    expect(retrieved.name).toBe(user.name);
  });
});
```

### API Tests

```javascript
import request from 'supertest';
import app from './app';

describe('POST /api/users', () => {
  it('creates user with valid data', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Test', email: 'test@test.com' })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe('Test');
  });

  it('returns 400 for invalid data', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: '' }) // invalid
      .expect(400);

    expect(response.body.error).toContain('name');
  });
});
```

---

## Anti-Patterns to Avoid

### Testing Implementation Details

```javascript
// Bad: tests internal state
it('adds item to internal array', () => {
  cart.addItem(item);
  expect(cart._items).toContain(item); // internal!
});

// Good: tests behavior
it('includes item in total', () => {
  cart.addItem({ price: 10 });
  expect(cart.getTotal()).toBe(10);
});
```

### Over-Mocking

```javascript
// Bad: mock everything
jest.mock('./utils');
jest.mock('./helpers');
jest.mock('./formatters');
// Now testing the mocks, not the code!

// Good: mock external dependencies only
jest.mock('./api'); // external API
// Keep internal modules real
```

### Flaky Tests

```javascript
// Bad: relies on timing
it('shows message after delay', async () => {
  render(<Component />);
  await new Promise(r => setTimeout(r, 1000));
  expect(screen.getByText('Done')).toBeInTheDocument();
});

// Good: use waitFor
it('shows message after delay', async () => {
  render(<Component />);
  await waitFor(() => {
    expect(screen.getByText('Done')).toBeInTheDocument();
  });
});
```

### Test Interdependence

```javascript
// Bad: test B depends on test A
let sharedUser;
it('A: creates user', () => { sharedUser = createUser(); });
it('B: uses user', () => { expect(sharedUser.name).toBe('Test'); });

// Good: each test is independent
it('creates and uses user', () => {
  const user = createUser();
  expect(user.name).toBe('Test');
});
```
