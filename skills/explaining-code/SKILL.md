---
name: explaining-code
description: Explains code with diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when asked "how does this work?"
---

# Explaining Code Skill

Explain code clearly using multiple techniques for different learning styles.

## Workflow

### 1. Understand the Context

**Before explaining, understand:**
- What is the user's knowledge level?
- What specifically do they want to understand?
- What's the scope? (single function, module, system)

### 2. Choose Explanation Strategy

| If they ask... | Start with... |
|----------------|---------------|
| "How does X work?" | High-level flow, then details |
| "What does this code do?" | Purpose, then step-by-step |
| "Why is it written this way?" | Problem it solves, alternatives |
| "I'm confused about..." | Clarify specific concept |

### 3. Build the Explanation

**Layer your explanation:**

1. **One sentence summary** - What is the core purpose?
2. **Analogy** - Relate to something familiar
3. **Visual diagram** - Show structure/flow
4. **Walk through** - Step by step with code
5. **Key concepts** - Highlight important patterns

### 4. Use Multiple Representations

**Different people learn differently:**

- **Visual learners**: Diagrams, flowcharts
- **Sequential learners**: Step-by-step walkthrough
- **Conceptual learners**: Analogies, mental models
- **Hands-on learners**: Example usage, experiments to try

## Explanation Techniques

### The Zoom Technique

Start wide, then zoom in:

```
System Level:  "This app handles user authentication"
     ↓
Module Level:  "This module manages sessions"
     ↓
Function Level: "This function validates tokens"
     ↓
Line Level:    "This line checks expiration"
```

### The Analogy Technique

Connect to familiar concepts:

| Code Concept | Real-world Analogy |
|--------------|-------------------|
| API | Restaurant menu + waiter |
| Cache | Sticky notes on your desk |
| Database | Filing cabinet |
| Queue | Line at a store |
| Stack | Stack of plates |
| Hash table | Library index cards |
| Middleware | Security checkpoint |
| Event loop | Receptionist handling calls |
| Promise | IOU note |
| Closure | Backpack carrying supplies |

### The Story Technique

Narrate the code as a story:

```
"When a user clicks login, our function wakes up.
First, it grabs the username and password from the form.
Then it sends them to the server and waits for a response.
If the server says 'OK', it saves the token and lets the user in.
If not, it shows an error message."
```

### The Diagram Technique

Use ASCII diagrams for structure and flow:

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│ Browser │────▶│   API   │────▶│   DB    │
└─────────┘     └─────────┘     └─────────┘
     │               │               │
     │  1. Request   │  2. Query     │
     │               │               │
     │  4. Response  │  3. Data      │
     │◀──────────────│◀──────────────│
```

## Quick Reference

### Explaining Functions

```
Purpose: [What problem does it solve?]
Inputs:  [What does it receive?]
Process: [What steps does it take?]
Output:  [What does it return?]
Side effects: [What else does it change?]
```

**Example:**
```javascript
function calculateDiscount(price, percentage) {
  return price * (1 - percentage / 100);
}
```

```
Purpose: Calculate price after applying a percentage discount
Inputs:
  - price: The original price (e.g., 100)
  - percentage: The discount percentage (e.g., 20 for 20%)
Process:
  1. Divide percentage by 100 to get decimal (20 → 0.20)
  2. Subtract from 1 to get remaining fraction (1 - 0.20 = 0.80)
  3. Multiply by price to get discounted price (100 × 0.80 = 80)
Output: The discounted price (80)
Side effects: None
```

### Explaining Classes

```
Responsibility: [What is this class in charge of?]
Data it holds:  [What state does it maintain?]
Actions it can: [What can you ask it to do?]
Collaborators:  [What other classes does it work with?]
```

### Explaining Systems

```
Purpose:     [What business problem does this solve?]
Components:  [What are the major parts?]
Data flow:   [How does information move through?]
Entry points: [How do users/systems interact with it?]
```

## Common Patterns to Explain

### Callback Pattern

```javascript
// "Do this task, and when you're done, call me back"
fetchData(url, function(result) {
  // This runs LATER, when data arrives
});
// Code here runs IMMEDIATELY, before data arrives
```

**Analogy:** Like ordering food and giving your number - you don't stand at the counter waiting.

### Promise Pattern

```javascript
// "I promise to give you a result eventually"
fetchData(url)
  .then(result => { /* handle success */ })
  .catch(error => { /* handle failure */ });
```

**Analogy:** Like a claim ticket at dry cleaning - you'll get your clothes, but not right now.

### Observer Pattern

```javascript
// "Tell me whenever something happens"
button.addEventListener('click', handleClick);
```

**Analogy:** Like subscribing to a newsletter - you get notified when new content arrives.

### Middleware Pattern

```javascript
// "Check this before passing it on"
app.use(authMiddleware);  // Runs first
app.use(loggingMiddleware); // Runs second
app.get('/api', handler);   // Runs last
```

**Analogy:** Like airport security - multiple checkpoints before you board.

## See Also

- [diagrams.md](./diagrams.md) - ASCII diagram patterns for code visualization
