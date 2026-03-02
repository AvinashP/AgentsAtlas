# OWASP Top 10 Checklist

Detailed checklist based on OWASP Top 10 2021.

## A01: Broken Access Control

Access control enforces policy such that users cannot act outside their intended permissions.

### Checklist

- [ ] Deny access by default (whitelist approach)
- [ ] Implement access control once, reuse throughout
- [ ] Every endpoint checks authorization
- [ ] Enforce record ownership (can't access others' data)
- [ ] Disable directory listing
- [ ] Log access control failures, alert on abuse
- [ ] Rate limit API access
- [ ] Invalidate sessions on logout
- [ ] JWT tokens short-lived with proper validation

### Code Review Points

```javascript
// Check: Does every route verify permissions?
router.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  // BAD: No check if requester can access this user
  res.json(user);
});

// GOOD:
router.get('/users/:id', requireAuth, async (req, res) => {
  if (req.params.id !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // ...
});
```

---

## A02: Cryptographic Failures

Sensitive data needs protection in transit and at rest.

### Checklist

- [ ] Classify data by sensitivity
- [ ] Don't store sensitive data unnecessarily
- [ ] Encrypt sensitive data at rest
- [ ] Use TLS for all data in transit
- [ ] Disable caching for sensitive responses
- [ ] Use strong, standard algorithms (AES, RSA, SHA-256)
- [ ] Use authenticated encryption (GCM, CCM)
- [ ] Keys generated cryptographically, stored securely
- [ ] Passwords hashed with salt (bcrypt, Argon2, scrypt)
- [ ] IVs not reused, generated randomly

### Code Review Points

```javascript
// Check: Password hashing
// BAD:
const hash = crypto.createHash('md5').update(password).digest('hex');

// GOOD:
const hash = await bcrypt.hash(password, 12);

// Check: Random generation
// BAD:
const token = Math.random().toString(36);

// GOOD:
const token = crypto.randomBytes(32).toString('hex');
```

---

## A03: Injection

Untrusted data sent to an interpreter as part of a command or query.

### Checklist

- [ ] Use parameterized queries / prepared statements
- [ ] Use ORM/ODM (but still be careful)
- [ ] Escape special characters in dynamic queries
- [ ] Validate and sanitize all user input
- [ ] Use LIMIT to prevent mass disclosure
- [ ] Avoid dynamic queries with string concatenation

### Types to Check

| Type | Pattern to Find |
|------|-----------------|
| SQL | `query(... + userInput)` |
| NoSQL | `{ $where: userInput }` |
| OS Command | `exec(userInput)` |
| LDAP | `filter=(userInput)` |
| XPath | `//users[name/text()='${input}']` |
| Template | `eval()`, `render(userInput)` |

### Code Review Points

```javascript
// SQL Injection
// BAD:
db.query(`SELECT * FROM users WHERE id = ${userId}`);

// GOOD:
db.query('SELECT * FROM users WHERE id = ?', [userId]);

// NoSQL Injection
// BAD:
User.find({ name: req.body.name }); // if name is { $gt: '' }

// GOOD:
User.find({ name: String(req.body.name) });

// Command Injection
// BAD:
exec(`convert ${filename} output.png`);

// GOOD:
execFile('convert', [filename, 'output.png']);
```

---

## A04: Insecure Design

Design flaws that can't be fixed by implementation.

### Checklist

- [ ] Threat modeling performed
- [ ] Secure design patterns used
- [ ] Reference architecture available
- [ ] Business logic abuse cases considered
- [ ] Rate limiting on expensive operations
- [ ] Resource limits per user
- [ ] Defense in depth (multiple layers)

### Design Questions

- What happens if a user tries this 1000 times?
- What if they skip a step in the workflow?
- What if they manipulate hidden fields?
- What if they access with a different role's URL?

---

## A05: Security Misconfiguration

Default configs, unnecessary features, verbose errors.

### Checklist

- [ ] Remove/disable unused features, frameworks, components
- [ ] Disable debug mode in production
- [ ] Review cloud service configurations
- [ ] Set security headers (HSTS, CSP, X-Frame-Options)
- [ ] Update dependencies and frameworks
- [ ] Remove default accounts/passwords
- [ ] Error messages don't reveal sensitive info
- [ ] Directory listing disabled

### Code Review Points

```javascript
// Check: Error handling
// BAD:
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.stack });
});

// GOOD:
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Check: Security headers
const helmet = require('helmet');
app.use(helmet());
```

---

## A06: Vulnerable and Outdated Components

Using components with known vulnerabilities.

### Checklist

- [ ] Know versions of all components (client & server)
- [ ] Remove unused dependencies
- [ ] Monitor for vulnerabilities (npm audit, Snyk)
- [ ] Obtain components from official sources
- [ ] Update components regularly
- [ ] Apply security patches promptly

### Commands

```bash
# JavaScript
npm audit
npm outdated
npx snyk test

# Python
pip-audit
safety check
pip list --outdated

# Go
go list -m -u all
```

---

## A07: Identification and Authentication Failures

Confirming identity, authentication, and session management.

### Checklist

- [ ] MFA available
- [ ] No default credentials
- [ ] Weak password checks implemented
- [ ] Brute force protection (lockout, CAPTCHA)
- [ ] Session IDs not in URL
- [ ] New session ID after login
- [ ] Sessions properly invalidated on logout
- [ ] Session timeout implemented
- [ ] Password recovery secure

### Code Review Points

```javascript
// Check: Session management
// BAD:
const sessionId = `session_${userId}`;

// GOOD:
const sessionId = crypto.randomBytes(32).toString('hex');

// Check: Password validation
// BAD:
if (password.length >= 6) { /* ok */ }

// GOOD:
if (password.length >= 12 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)) { /* ok */ }
```

---

## A08: Software and Data Integrity Failures

Code and infrastructure that doesn't protect against integrity violations.

### Checklist

- [ ] Digital signatures verify integrity
- [ ] Libraries from trusted repositories
- [ ] Software supply chain security (signed commits)
- [ ] CI/CD pipelines secured
- [ ] Unsigned/unencrypted serialized data not trusted
- [ ] Deserialization input validated

### Code Review Points

```javascript
// Check: Deserialization
// BAD:
const data = eval(userInput);
const data = JSON.parse(userInput); // if used for code exec

// GOOD:
const data = JSON.parse(userInput);
validateSchema(data); // Validate structure
```

---

## A09: Security Logging and Monitoring Failures

Insufficient logging to detect, escalate, or respond to attacks.

### Checklist

- [ ] Login, access control, and input validation failures logged
- [ ] Logs contain sufficient context
- [ ] Logs not visible to users
- [ ] Log injection prevented
- [ ] Alerting thresholds defined
- [ ] Incident response plan exists
- [ ] Audit trails for sensitive operations

### Code Review Points

```javascript
// Check: Logging sensitive data
// BAD:
logger.info('Login attempt', { email, password });

// GOOD:
logger.info('Login attempt', { email, result: 'failed', reason: 'invalid_password' });

// Check: Log injection
// BAD:
logger.info(`User input: ${userInput}`); // Could inject newlines

// GOOD:
logger.info('User input', { input: userInput.replace(/\n/g, '\\n') });
```

---

## A10: Server-Side Request Forgery (SSRF)

Fetching remote resources without validating user-supplied URLs.

### Checklist

- [ ] Sanitize and validate all client-supplied URLs
- [ ] Enforce allowlist of allowed URL schemas and destinations
- [ ] Don't send raw responses to clients
- [ ] Disable HTTP redirects
- [ ] Network segmentation to isolate resources

### Code Review Points

```javascript
// Check: URL fetching
// BAD:
const response = await fetch(req.body.url);
res.json(await response.json());

// GOOD:
const url = new URL(req.body.url);
if (!ALLOWED_HOSTS.includes(url.hostname)) {
  return res.status(400).json({ error: 'Invalid URL' });
}
// Also: block private IP ranges
```

### Private IP Ranges to Block

```
10.0.0.0/8
172.16.0.0/12
192.168.0.0/16
127.0.0.0/8
169.254.0.0/16 (link-local)
```
