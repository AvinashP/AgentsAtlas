# Framework-Specific Testing Patterns

## Jest (JavaScript/TypeScript)

### Setup
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node', // or 'jsdom' for browser
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
};
```

### Basic Structure
```javascript
describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return user by id', async () => {
      const user = await service.getUser('123');
      expect(user).toEqual({ id: '123', name: 'Test' });
    });

    it('should throw for invalid id', async () => {
      await expect(service.getUser('')).rejects.toThrow('Invalid ID');
    });
  });
});
```

### Mocking
```javascript
// Mock module
jest.mock('./database');
import { db } from './database';
const mockDb = db as jest.Mocked<typeof db>;

// Mock implementation
mockDb.query.mockResolvedValue([{ id: 1 }]);

// Mock function
const mockFn = jest.fn().mockReturnValue('test');

// Spy on method
jest.spyOn(object, 'method').mockImplementation(() => 'mocked');

// Reset between tests
beforeEach(() => jest.clearAllMocks());
```

### Async Testing
```javascript
// Async/await
it('fetches data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

// Promises
it('fetches data', () => {
  return fetchData().then(data => {
    expect(data).toBeDefined();
  });
});

// Timers
jest.useFakeTimers();
it('debounces', () => {
  debounce(fn, 100);
  jest.advanceTimersByTime(100);
  expect(fn).toHaveBeenCalled();
});
```

### Snapshot Testing
```javascript
it('renders correctly', () => {
  const tree = renderer.create(<Button>Click</Button>).toJSON();
  expect(tree).toMatchSnapshot();
});
```

---

## Vitest (Modern JS/TS)

### Setup
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

### Basic Structure
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Calculator', () => {
  it('adds numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

### Mocking
```typescript
// Mock module
vi.mock('./api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ name: 'Test' }),
}));

// Mock function
const mockFn = vi.fn();

// Spy
vi.spyOn(object, 'method');

// Reset
beforeEach(() => vi.clearAllMocks());
```

---

## Pytest (Python)

### Setup
```ini
# pytest.ini
[pytest]
testpaths = tests
python_files = test_*.py
python_functions = test_*
```

### Basic Structure
```python
import pytest
from mymodule import Calculator

class TestCalculator:
    def setup_method(self):
        self.calc = Calculator()

    def test_add(self):
        assert self.calc.add(1, 2) == 3

    def test_divide_by_zero(self):
        with pytest.raises(ZeroDivisionError):
            self.calc.divide(1, 0)
```

### Fixtures
```python
import pytest

@pytest.fixture
def db_connection():
    conn = create_connection()
    yield conn
    conn.close()

@pytest.fixture
def sample_user():
    return {"id": 1, "name": "Test"}

def test_get_user(db_connection, sample_user):
    result = db_connection.get_user(sample_user["id"])
    assert result["name"] == sample_user["name"]
```

### Mocking
```python
from unittest.mock import Mock, patch, MagicMock

# Patch decorator
@patch('mymodule.external_api')
def test_with_mock(mock_api):
    mock_api.return_value = {'data': 'test'}
    result = my_function()
    assert result == {'data': 'test'}

# Context manager
def test_with_context():
    with patch('mymodule.external_api') as mock_api:
        mock_api.return_value = {'data': 'test'}
        result = my_function()
        assert result == {'data': 'test'}

# Mock object
mock = Mock()
mock.method.return_value = 'test'
```

### Parametrized Tests
```python
@pytest.mark.parametrize("input,expected", [
    (1, 2),
    (2, 4),
    (3, 6),
])
def test_double(input, expected):
    assert double(input) == expected
```

---

## Go Testing

### Basic Structure
```go
// calculator_test.go
package calculator

import "testing"

func TestAdd(t *testing.T) {
    result := Add(1, 2)
    if result != 3 {
        t.Errorf("Add(1, 2) = %d; want 3", result)
    }
}

func TestAdd_Table(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive", 1, 2, 3},
        {"negative", -1, -2, -3},
        {"zero", 0, 0, 0},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := Add(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("got %d, want %d", result, tt.expected)
            }
        })
    }
}
```

### Subtests and Setup
```go
func TestUser(t *testing.T) {
    // Setup
    db := setupTestDB()
    defer db.Close()

    t.Run("Create", func(t *testing.T) {
        // test create
    })

    t.Run("Get", func(t *testing.T) {
        // test get
    })
}
```

---

## React Testing Library

### Component Testing
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

### Async Components
```typescript
it('loads and displays data', async () => {
  render(<UserProfile userId="123" />);

  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  // Check data displayed
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

### Form Testing
```typescript
it('submits form with values', async () => {
  const handleSubmit = jest.fn();
  render(<ContactForm onSubmit={handleSubmit} />);

  await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
  await userEvent.type(screen.getByLabelText('Message'), 'Hello');
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    message: 'Hello',
  });
});
```
