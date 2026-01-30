---
name: brainstorming
description: Use before any creative work - creating features, building components, adding functionality. Explores requirements and design through collaborative dialogue before implementation.
---

# Brainstorming Ideas Into Designs

Turn rough ideas into fully formed designs through natural collaborative dialogue.

## The Process

### 1. Understanding the Idea

**Before proposing anything:**
- Check out the current project state (files, docs, recent commits)
- Ask questions one at a time to refine the idea
- Prefer multiple choice questions when possible
- Focus on understanding: purpose, constraints, success criteria

**One question at a time** - Don't overwhelm with multiple questions. If a topic needs more exploration, break it into multiple questions.

### 2. Exploring Approaches

Once you understand the problem:
- Propose 2-3 different approaches with trade-offs
- Lead with your recommended option and explain why
- Present options conversationally

**Example:**
```
For caching, I see three approaches:

1. In-memory cache (recommended) - Simple, no dependencies,
   works well for your scale. Trade-off: lost on restart.

2. Redis - Shared across instances, persistent.
   Trade-off: Extra infrastructure.

3. File-based - Simple, persistent.
   Trade-off: Slower, file locking complexity.

I'd recommend #1 unless you need persistence or multi-instance.
What matters most to you?
```

### 3. Presenting the Design

Once you believe you understand what you're building:
- Present the design in sections of 200-300 words
- Ask after each section whether it looks right so far
- Cover: architecture, components, data flow, error handling, testing
- Be ready to go back and clarify if something doesn't make sense

**Example section:**
```
## Data Flow

When a user submits a form:
1. Frontend validates input, shows inline errors
2. POST to /api/submit with JSON body
3. Backend validates again (never trust client)
4. Store in database, return ID
5. Frontend shows success with link to view

Does this flow make sense, or should we handle any edge cases differently?
```

## After the Design

**Documentation:**
- Write the validated design to a design doc if appropriate
- Include: goal, architecture, components, data flow, testing approach

**Implementation:**
- Ask: "Ready to start implementation?"
- Break into small tasks (2-5 minutes each)
- Use TDD for each task

## Key Principles

| Principle | Why |
|-----------|-----|
| **One question at a time** | Don't overwhelm |
| **Multiple choice preferred** | Easier to answer than open-ended |
| **YAGNI ruthlessly** | Remove unnecessary features from all designs |
| **Explore alternatives** | Always propose 2-3 approaches before settling |
| **Incremental validation** | Present design in sections, validate each |
| **Be flexible** | Go back and clarify when something doesn't make sense |

## Good Questions

**Understanding scope:**
- "What problem are you trying to solve?"
- "Who will use this?"
- "What does success look like?"

**Clarifying constraints:**
- "Does this need to work offline?"
- "How many users/requests do you expect?"
- "What's the timeline?"

**Multiple choice:**
- "Should errors (a) show inline, (b) show in a toast, or (c) redirect to error page?"
- "For auth, prefer (a) sessions, (b) JWT, or (c) OAuth?"

## Red Flags

- Jumping to implementation without understanding requirements
- Proposing only one approach
- Writing design doc before validating with user
- Adding features user didn't ask for
- Not asking about constraints
- Presenting entire design at once without checkpoints

## Example Flow

```
User: "I need a way to export reports"

You: "Before I propose anything, let me understand the requirements.
What format do you need the exports in?
(a) CSV - simple, works in Excel
(b) PDF - formatted, good for sharing
(c) Both
(d) Something else"

User: "CSV is fine"

You: "Got it. A few more questions:
How large are these reports typically?
(a) Small - under 1000 rows
(b) Medium - 1000-100k rows
(c) Large - over 100k rows"

User: "Medium usually, sometimes large"

You: "For that size, I'd recommend streaming the CSV generation
rather than building it all in memory. Here's the approach:

## Export Flow
1. User clicks Export button
2. Backend starts streaming response with CSV headers
3. Query database in batches of 1000 rows
4. Stream each batch to response as CSV
5. Client downloads as file

This handles large files without memory issues.
Does this approach work for you?"
```

## The Bottom Line

**Understand before you build.**

Ask questions. Propose options. Validate incrementally.

Don't start coding until the design is clear.
