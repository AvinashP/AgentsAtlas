# Node.js Templates

Templates for Node.js/Express applications. Match to your project's conventions.

## Express Router

### Basic Router

```typescript
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const items = await ItemService.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const item = await ItemService.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const item = await ItemService.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const item = await ItemService.update(req.params.id, req.body);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await ItemService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;
```

---

## Service Class

```typescript
import { db } from '../db';

interface CreateItemInput {
  name: string;
  description?: string;
}

interface UpdateItemInput {
  name?: string;
  description?: string;
}

interface Item {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ItemService {
  static async findAll(): Promise<Item[]> {
    return db.item.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findById(id: string): Promise<Item | null> {
    return db.item.findUnique({ where: { id } });
  }

  static async create(data: CreateItemInput): Promise<Item> {
    return db.item.create({ data });
  }

  static async update(id: string, data: UpdateItemInput): Promise<Item | null> {
    try {
      return await db.item.update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await db.item.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
```

---

## Middleware

### Authentication Middleware

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}
```

### Validation Middleware

```typescript
import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        });
      }
      next(error);
    }
  };
}

// Usage:
const createItemSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
  }),
});

router.post('/', validate(createItemSchema), createItem);
```

---

## Error Handler

```typescript
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }

  // Don't leak error details in production
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message;

  res.status(500).json({ error: message });
}
```

---

## Database Model (Prisma)

```prisma
// schema.prisma

model Item {
  id          String   @id @default(cuid())
  name        String
  description String?
  status      Status   @default(ACTIVE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId      String
  user        User     @relation(fields: [userId], references: [id])

  @@index([userId])
  @@map("items")
}

enum Status {
  ACTIVE
  ARCHIVED
  DELETED
}
```

---

## Test File (Jest)

```typescript
import request from 'supertest';
import app from '../app';
import { db } from '../db';

describe('Items API', () => {
  beforeEach(async () => {
    await db.item.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  describe('GET /api/items', () => {
    it('returns empty array when no items', async () => {
      const response = await request(app)
        .get('/api/items')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('returns all items', async () => {
      await db.item.create({
        data: { name: 'Test Item' },
      });

      const response = await request(app)
        .get('/api/items')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Test Item');
    });
  });

  describe('POST /api/items', () => {
    it('creates item with valid data', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: 'New Item' })
        .expect(201);

      expect(response.body.name).toBe('New Item');
      expect(response.body.id).toBeDefined();
    });

    it('returns 400 for invalid data', async () => {
      await request(app)
        .post('/api/items')
        .send({ name: '' })
        .expect(400);
    });
  });

  describe('GET /api/items/:id', () => {
    it('returns item by id', async () => {
      const item = await db.item.create({
        data: { name: 'Test Item' },
      });

      const response = await request(app)
        .get(`/api/items/${item.id}`)
        .expect(200);

      expect(response.body.name).toBe('Test Item');
    });

    it('returns 404 for non-existent id', async () => {
      await request(app)
        .get('/api/items/non-existent-id')
        .expect(404);
    });
  });
});
```

---

## Queue Worker (Bull)

```typescript
import Bull from 'bull';

interface EmailJobData {
  to: string;
  subject: string;
  body: string;
}

export const emailQueue = new Bull<EmailJobData>('email', {
  redis: process.env.REDIS_URL,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

emailQueue.process(async (job) => {
  const { to, subject, body } = job.data;

  console.log(`Sending email to ${to}: ${subject}`);

  await sendEmail({ to, subject, body });

  return { sent: true };
});

emailQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
});

emailQueue.on('failed', (job, error) => {
  console.error(`Job ${job?.id} failed:`, error);
});

// Add job:
export async function queueEmail(data: EmailJobData) {
  return emailQueue.add(data);
}
```

---

## CLI Script

```typescript
#!/usr/bin/env node

import { Command } from 'commander';
import { version } from '../package.json';

const program = new Command();

program
  .name('my-cli')
  .description('CLI tool description')
  .version(version);

program
  .command('init')
  .description('Initialize a new project')
  .option('-n, --name <name>', 'project name')
  .action((options) => {
    console.log(`Initializing project: ${options.name || 'my-project'}`);
    // Implementation
  });

program
  .command('generate <type>')
  .description('Generate a new resource')
  .option('-p, --path <path>', 'output path')
  .action((type, options) => {
    console.log(`Generating ${type} at ${options.path || './'}`);
    // Implementation
  });

program.parse();
```
