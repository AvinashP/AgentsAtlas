# Python Verification

Custom verification workflow for Python projects.

## Process

For each task verification:

1. **Type checking** (if using mypy/pyright):
   ```bash
   mypy .
   # or: pyright
   ```

2. **Linting**:
   ```bash
   ruff check .
   # or: flake8
   # or: pylint
   ```

3. **Unit tests**:
   ```bash
   pytest
   # or: python -m pytest
   # or: python -m unittest discover
   ```

4. **Integration tests** (if applicable):
   ```bash
   pytest tests/integration/
   ```

## Success Criteria

- [ ] No type errors (if using type checker)
- [ ] Linting passes
- [ ] All unit tests pass
- [ ] Integration tests pass (if changed integration code)

## When to Skip

- Config-only changes → Skip tests
- Documentation → Skip all
- Test file changes → Run only affected tests

## Virtual Environment

Ensure tests run in the correct environment:
```bash
source venv/bin/activate  # or: poetry shell, pipenv shell
pytest
```

## Hints

The `<verify>` field from the task provides context on what specifically to verify.
Use it to scope the verification appropriately.
