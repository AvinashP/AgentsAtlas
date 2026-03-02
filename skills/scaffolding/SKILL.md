---
name: scaffolding
description: Generates boilerplate following project conventions. Use when asked to create a new component, module, service, or scaffold code.
---

# Scaffolding Skill

Generate boilerplate code that matches existing project conventions.

## Workflow

### 1. Detect Project Conventions

**Before generating, find existing patterns:**

```bash
# Find similar files
find . -name "*.tsx" -path "*/components/*" | head -5

# Check file structure
ls -la src/components/

# Look at existing code
cat src/components/Button/Button.tsx
```

**Key conventions to detect:**
- File/folder structure (flat vs nested)
- Naming conventions (PascalCase, camelCase, kebab-case)
- Export style (default vs named)
- Import style (relative vs aliases)
- Test co-location (same folder or separate)
- Styling approach (CSS Modules, styled-components, Tailwind)

### 2. Match Project Style

**Always match:**

| Aspect | Check for |
|--------|-----------|
| File naming | `Button.tsx`, `button.tsx`, `Button.component.tsx` |
| Folder structure | `Button/index.tsx` or `Button.tsx` |
| Component style | function vs arrow, FC type vs implicit |
| Props definition | interface vs type, inline vs separate |
| Exports | `export default` vs `export const` |
| Test files | `.test.tsx`, `.spec.tsx`, `__tests__/` |

### 3. Generate Code

**Include what's standard in the project:**

- [ ] Main file (component/module)
- [ ] Types/interfaces (if TypeScript)
- [ ] Test file (if tests exist nearby)
- [ ] Index file (if using barrel exports)
- [ ] Styles (if using CSS Modules)
- [ ] Stories (if using Storybook)

### 4. Verify Output

**Check generated code:**
- Follows detected conventions
- Imports resolve correctly
- TypeScript compiles (if applicable)
- Matches similar files in project

## Quick Reference

### Scaffolding Commands

Ask for scaffolding like:
- "Create a new UserProfile component"
- "Scaffold a PaymentService"
- "Generate a useAuth hook"
- "Create a products API route"

### What to Generate

| Type | Usually Includes |
|------|-----------------|
| React Component | Component file, types, test, styles, index |
| API Route | Handler, types, validation, test |
| Service | Class/module, types, test |
| Hook | Hook file, types, test |
| Utility | Function file, types, test |

### File Detection Patterns

```bash
# Detect React style
grep -l "React.FC\|: FC<" src/**/*.tsx  # Typed FC
grep -l "function.*Props" src/**/*.tsx  # Function with props

# Detect test pattern
ls src/**/*.test.* 2>/dev/null  # Co-located
ls tests/ 2>/dev/null            # Separate folder

# Detect styling
ls src/**/*.module.css 2>/dev/null  # CSS Modules
grep "styled\." src/**/*.tsx         # styled-components
grep "className=" src/**/*.tsx       # Tailwind/CSS
```

## Templates

Templates are available for common stacks:

- [react.md](./react.md) - React component templates
- [node.md](./node.md) - Node.js/Express templates
- [python.md](./python.md) - Python module templates

## Best Practices

### Do:
- Match existing patterns exactly
- Include all files that similar modules have
- Use the same folder structure
- Copy import styles from nearby files

### Don't:
- Introduce new patterns
- Add "improvements" to the template
- Skip files that peers have (like tests)
- Use different naming conventions

## Example

**Request:** "Create a UserCard component"

**Detection:**
```
Existing components use:
- Folder structure: ComponentName/index.tsx
- Style: CSS Modules (ComponentName.module.css)
- Tests: ComponentName.test.tsx in same folder
- Types: Props interface in same file
- Exports: default export
```

**Generated files:**
```
src/components/UserCard/
├── index.tsx
├── UserCard.module.css
└── UserCard.test.tsx
```

**index.tsx matches existing style:**
```tsx
import styles from './UserCard.module.css';

interface UserCardProps {
  name: string;
  email: string;
}

export default function UserCard({ name, email }: UserCardProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.email}>{email}</p>
    </div>
  );
}
```
