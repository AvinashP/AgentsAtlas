# React Component Templates

Templates for React components. Match to your project's conventions.

## Functional Component (TypeScript)

### With Typed Props

```tsx
interface ComponentNameProps {
  title: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export default function ComponentName({
  title,
  onAction,
  children,
}: ComponentNameProps) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  );
}
```

### With React.FC (alternative style)

```tsx
import { FC } from 'react';

interface ComponentNameProps {
  title: string;
  onAction?: () => void;
}

export const ComponentName: FC<ComponentNameProps> = ({ title, onAction }) => {
  return (
    <div>
      <h2>{title}</h2>
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  );
};
```

---

## With State and Effects

```tsx
import { useState, useEffect } from 'react';

interface DataDisplayProps {
  id: string;
}

export default function DataDisplay({ id }: DataDisplayProps) {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await api.getData(id);
        setData(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div>
      <h2>{data.title}</h2>
      <p>{data.description}</p>
    </div>
  );
}
```

---

## With CSS Modules

### Component

```tsx
import styles from './ComponentName.module.css';

interface ComponentNameProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export default function ComponentName({
  variant = 'primary',
  children,
}: ComponentNameProps) {
  return (
    <div className={`${styles.container} ${styles[variant]}`}>
      {children}
    </div>
  );
}
```

### CSS Module

```css
/* ComponentName.module.css */
.container {
  padding: 1rem;
  border-radius: 4px;
}

.primary {
  background-color: var(--primary-color);
  color: white;
}

.secondary {
  background-color: var(--secondary-color);
  color: black;
}
```

---

## With Tailwind CSS

```tsx
interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
}

export default function Card({ title, description, imageUrl }: CardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
    </div>
  );
}
```

---

## With styled-components

```tsx
import styled from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
}

const StyledButton = styled.button<{ $variant: string; $size: string }>`
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  ${({ $size }) => {
    switch ($size) {
      case 'small': return 'padding: 4px 8px; font-size: 12px;';
      case 'large': return 'padding: 12px 24px; font-size: 18px;';
      default: return 'padding: 8px 16px; font-size: 14px;';
    }
  }}

  ${({ $variant }) =>
    $variant === 'primary'
      ? 'background-color: #007bff; color: white;'
      : 'background-color: #6c757d; color: white;'
  }

  &:hover {
    opacity: 0.9;
  }
`;

export default function Button({
  variant = 'primary',
  size = 'medium',
  children,
  onClick,
}: ButtonProps) {
  return (
    <StyledButton $variant={variant} $size={size} onClick={onClick}>
      {children}
    </StyledButton>
  );
}
```

---

## Custom Hook

```tsx
import { useState, useCallback } from 'react';

interface UseToggleResult {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export function useToggle(initialState = false): UseToggleResult {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, toggle, open, close };
}
```

---

## Context Provider

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

---

## Test File (Jest + Testing Library)

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('renders with required props', () => {
    render(<ComponentName title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onAction when button is clicked', async () => {
    const handleAction = jest.fn();
    render(<ComponentName title="Test" onAction={handleAction} />);

    await userEvent.click(screen.getByRole('button'));

    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('renders children', () => {
    render(
      <ComponentName title="Test">
        <span>Child content</span>
      </ComponentName>
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
});
```

---

## Storybook Story

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import ComponentName from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    title: 'Default Title',
  },
};

export const WithAction: Story = {
  args: {
    title: 'With Action',
    onAction: () => alert('Action clicked!'),
  },
};

export const Secondary: Story = {
  args: {
    title: 'Secondary Variant',
    variant: 'secondary',
  },
};
```
