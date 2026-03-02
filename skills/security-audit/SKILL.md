---
name: security-audit
description: Audits code for security vulnerabilities. Use when asked to check security, find vulnerabilities, or audit for OWASP issues.
---

# Security Audit Skill

Systematically audit code for common security vulnerabilities.

## Workflow

### 1. Identify Attack Surface

**Map entry points:**
- API endpoints
- User input forms
- File uploads
- URL parameters
- Headers and cookies
- WebSocket messages

```bash
# Find API routes
grep -r "app.get\|app.post\|router\." --include="*.ts" --include="*.js"

# Find form handlers
grep -r "onSubmit\|handleSubmit" --include="*.tsx" --include="*.jsx"
```

### 2. Check OWASP Top 10

Go through each category systematically:

| # | Category | What to Check |
|---|----------|---------------|
| 1 | Broken Access Control | Auth checks on all endpoints |
| 2 | Cryptographic Failures | Sensitive data exposure |
| 3 | Injection | User input in queries/commands |
| 4 | Insecure Design | Business logic flaws |
| 5 | Security Misconfiguration | Default configs, headers |
| 6 | Vulnerable Components | Outdated dependencies |
| 7 | Auth Failures | Weak passwords, session issues |
| 8 | Data Integrity Failures | Unverified updates, CI/CD |
| 9 | Logging Failures | Missing audit trails |
| 10 | SSRF | Server-side request forgery |

### 3. Review Code Patterns

**Search for dangerous patterns:**

```bash
# SQL injection risks
grep -r "query.*\${" --include="*.ts"
grep -r "execute.*+" --include="*.py"

# Command injection risks
grep -r "exec\|spawn\|system" --include="*.ts" --include="*.js"

# XSS risks
grep -r "innerHTML\|dangerouslySetInnerHTML" --include="*.tsx"

# Hardcoded secrets
grep -r "password\|secret\|api_key\|token" --include="*.ts" --include="*.env*"
```

### 4. Check Dependencies

```bash
# JavaScript
npm audit
npx snyk test

# Python
pip-audit
safety check
```

### 5. Document Findings

**For each vulnerability:**
- Severity (Critical/High/Medium/Low)
- Location (file:line)
- Description
- Proof of concept (if safe)
- Recommended fix

## Quick Reference

### Common Vulnerabilities

#### Injection (SQL, NoSQL, Command, LDAP)

**Vulnerable:**
```javascript
// SQL injection
const query = `SELECT * FROM users WHERE id = ${userId}`;

// Command injection
exec(`convert ${userFilename} output.png`);

// NoSQL injection
User.find({ username: req.body.username });
```

**Fixed:**
```javascript
// Parameterized query
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);

// Validate/escape input
const safeFilename = path.basename(userFilename);
exec(`convert ${shellescape([safeFilename])} output.png`);

// Sanitize NoSQL input
User.find({ username: String(req.body.username) });
```

#### Cross-Site Scripting (XSS)

**Vulnerable:**
```javascript
// Reflected XSS
element.innerHTML = userInput;

// Stored XSS
<div dangerouslySetInnerHTML={{ __html: comment }} />
```

**Fixed:**
```javascript
// Use textContent
element.textContent = userInput;

// Sanitize HTML
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment) }} />
```

#### Broken Authentication

**Vulnerable:**
```javascript
// Weak session
const sessionId = Math.random().toString();

// No rate limiting on login
app.post('/login', (req, res) => { /* no limit */ });

// Password in URL
window.location = `/login?password=${password}`;
```

**Fixed:**
```javascript
// Strong session ID
const sessionId = crypto.randomBytes(32).toString('hex');

// Rate limiting
app.post('/login', rateLimit({ max: 5, windowMs: 15*60*1000 }), ...);

// POST body for credentials
fetch('/login', { method: 'POST', body: JSON.stringify({ password }) });
```

#### Sensitive Data Exposure

**Vulnerable:**
```javascript
// Logging sensitive data
console.log('User login:', { email, password });

// Error details to client
res.status(500).json({ error: err.stack });

// Hardcoded secrets
const API_KEY = 'sk-1234567890abcdef';
```

**Fixed:**
```javascript
// Sanitize logs
console.log('User login:', { email, password: '[REDACTED]' });

// Generic error
res.status(500).json({ error: 'Internal server error' });

// Environment variables
const API_KEY = process.env.API_KEY;
```

### Security Headers Checklist

```javascript
// Required headers
helmet({
  contentSecurityPolicy: true,      // XSS protection
  hsts: true,                       // Force HTTPS
  noSniff: true,                    // MIME type sniffing
  frameguard: { action: 'deny' },   // Clickjacking
  xssFilter: true                   // XSS filter
});
```

### Authentication Checklist

- [ ] Passwords hashed with bcrypt/argon2
- [ ] Session tokens are cryptographically random
- [ ] Sessions expire and can be invalidated
- [ ] MFA available for sensitive operations
- [ ] Password requirements enforced
- [ ] Account lockout after failed attempts
- [ ] Secure cookie flags (HttpOnly, Secure, SameSite)

### Authorization Checklist

- [ ] Every endpoint checks permissions
- [ ] IDs in URLs are validated against user
- [ ] Elevation of privilege paths reviewed
- [ ] Admin functions separated
- [ ] Default deny policy

## See Also

- [owasp.md](./owasp.md) - Full OWASP Top 10 checklist
- [scripts/check_secrets.py](./scripts/check_secrets.py) - Secret scanning script
