# Refactoring Patterns

Detailed patterns with before/after examples.

## Composing Methods

### Extract Method

**When:** A code fragment can be grouped together.

```javascript
// Before
function printOwing() {
  printBanner();

  // Print details
  console.log('name: ' + name);
  console.log('amount: ' + getOutstanding());
}

// After
function printOwing() {
  printBanner();
  printDetails();
}

function printDetails() {
  console.log('name: ' + name);
  console.log('amount: ' + getOutstanding());
}
```

### Inline Method

**When:** A method's body is as clear as its name.

```javascript
// Before
function getRating() {
  return moreThanFiveLateDeliveries() ? 2 : 1;
}

function moreThanFiveLateDeliveries() {
  return numberOfLateDeliveries > 5;
}

// After
function getRating() {
  return numberOfLateDeliveries > 5 ? 2 : 1;
}
```

### Replace Temp with Query

**When:** A temporary variable holds a calculation that could be a method.

```javascript
// Before
function calculateTotal() {
  const basePrice = quantity * itemPrice;
  if (basePrice > 1000) {
    return basePrice * 0.95;
  }
  return basePrice * 0.98;
}

// After
function calculateTotal() {
  if (basePrice() > 1000) {
    return basePrice() * 0.95;
  }
  return basePrice() * 0.98;
}

function basePrice() {
  return quantity * itemPrice;
}
```

---

## Moving Features

### Move Method

**When:** A method uses features of another class more than its own.

```javascript
// Before
class Account {
  overdraftCharge() {
    if (this.type.isPremium()) {
      const result = 10;
      if (this.daysOverdrawn > 7) {
        result += (this.daysOverdrawn - 7) * 0.85;
      }
      return result;
    }
    return this.daysOverdrawn * 1.75;
  }
}

// After
class AccountType {
  overdraftCharge(daysOverdrawn) {
    if (this.isPremium()) {
      const result = 10;
      if (daysOverdrawn > 7) {
        result += (daysOverdrawn - 7) * 0.85;
      }
      return result;
    }
    return daysOverdrawn * 1.75;
  }
}

class Account {
  overdraftCharge() {
    return this.type.overdraftCharge(this.daysOverdrawn);
  }
}
```

### Move Field

**When:** A field is used more by another class.

```javascript
// Before
class Customer {
  plan: Plan;
  discountRate: number;
}

// After (discountRate used more with Plan)
class Plan {
  discountRate: number;
}

class Customer {
  plan: Plan;

  get discountRate() {
    return this.plan.discountRate;
  }
}
```

---

## Organizing Data

### Replace Primitive with Object

**When:** A primitive has behavior or validation.

```javascript
// Before
class Order {
  customer: string; // customer ID
}

// After
class CustomerId {
  constructor(private value: string) {
    if (!value.match(/^C\d{6}$/)) {
      throw new Error('Invalid customer ID format');
    }
  }

  toString() { return this.value; }
  equals(other: CustomerId) { return this.value === other.value; }
}

class Order {
  customer: CustomerId;
}
```

### Replace Array with Object

**When:** An array contains elements with different meanings.

```javascript
// Before
const row = ['Liverpool', 15, 8];
const name = row[0];
const wins = row[1];

// After
const row = {
  name: 'Liverpool',
  wins: 15,
  losses: 8
};
const { name, wins } = row;
```

### Encapsulate Collection

**When:** A method returns a collection directly.

```javascript
// Before
class Course {
  get students() {
    return this._students;
  }

  set students(list) {
    this._students = list;
  }
}

// After
class Course {
  get students() {
    return [...this._students]; // Return copy
  }

  addStudent(student) {
    this._students.push(student);
  }

  removeStudent(student) {
    const index = this._students.indexOf(student);
    if (index > -1) this._students.splice(index, 1);
  }
}
```

---

## Simplifying Conditionals

### Decompose Conditional

**When:** Complex conditional logic obscures intent.

```javascript
// Before
if (date.before(SUMMER_START) || date.after(SUMMER_END)) {
  charge = quantity * winterRate + winterServiceCharge;
} else {
  charge = quantity * summerRate;
}

// After
if (isSummer(date)) {
  charge = summerCharge(quantity);
} else {
  charge = winterCharge(quantity);
}

function isSummer(date) {
  return !date.before(SUMMER_START) && !date.after(SUMMER_END);
}

function summerCharge(quantity) {
  return quantity * summerRate;
}

function winterCharge(quantity) {
  return quantity * winterRate + winterServiceCharge;
}
```

### Consolidate Conditional Expression

**When:** Multiple conditionals have the same result.

```javascript
// Before
function disabilityAmount() {
  if (seniority < 2) return 0;
  if (monthsDisabled > 12) return 0;
  if (isPartTime) return 0;
  // compute disability amount
}

// After
function disabilityAmount() {
  if (isNotEligibleForDisability()) return 0;
  // compute disability amount
}

function isNotEligibleForDisability() {
  return seniority < 2 || monthsDisabled > 12 || isPartTime;
}
```

### Replace Nested Conditional with Guard Clauses

**When:** Deep nesting obscures the normal flow.

```javascript
// Before
function getPayAmount() {
  let result;
  if (isDead) {
    result = deadAmount();
  } else {
    if (isSeparated) {
      result = separatedAmount();
    } else {
      if (isRetired) {
        result = retiredAmount();
      } else {
        result = normalPayAmount();
      }
    }
  }
  return result;
}

// After
function getPayAmount() {
  if (isDead) return deadAmount();
  if (isSeparated) return separatedAmount();
  if (isRetired) return retiredAmount();
  return normalPayAmount();
}
```

### Replace Conditional with Polymorphism

**When:** Conditional chooses behavior based on type.

```javascript
// Before
function plumage(bird) {
  switch (bird.type) {
    case 'EuropeanSwallow':
      return 'average';
    case 'AfricanSwallow':
      return bird.numberOfCoconuts > 2 ? 'tired' : 'average';
    case 'NorwegianBlueParrot':
      return bird.voltage > 100 ? 'scorched' : 'beautiful';
    default:
      return 'unknown';
  }
}

// After
class Bird {
  plumage() { return 'unknown'; }
}

class EuropeanSwallow extends Bird {
  plumage() { return 'average'; }
}

class AfricanSwallow extends Bird {
  plumage() {
    return this.numberOfCoconuts > 2 ? 'tired' : 'average';
  }
}

class NorwegianBlueParrot extends Bird {
  plumage() {
    return this.voltage > 100 ? 'scorched' : 'beautiful';
  }
}
```

---

## Dealing with Generalization

### Pull Up Method

**When:** Subclasses have identical methods.

```javascript
// Before
class Salesman {
  getName() { return this.name; }
}
class Engineer {
  getName() { return this.name; }
}

// After
class Employee {
  getName() { return this.name; }
}
class Salesman extends Employee {}
class Engineer extends Employee {}
```

### Push Down Method

**When:** Behavior is relevant only to some subclasses.

```javascript
// Before
class Employee {
  getQuota() { /* only relevant for salesmen */ }
}

// After
class Employee {}

class Salesman extends Employee {
  getQuota() { /* implementation */ }
}
```

### Extract Superclass

**When:** Classes have similar features.

```javascript
// Before
class Department {
  totalAnnualCost() { /* sum of employee costs */ }
  name: string;
  headCount: number;
}

class Employee {
  annualCost() { /* salary calculation */ }
  name: string;
  id: number;
}

// After
class Party {
  name: string;
  annualCost() { /* abstract or default */ }
}

class Department extends Party {
  headCount: number;
  annualCost() { return this.staff.reduce((sum, e) => sum + e.annualCost, 0); }
}

class Employee extends Party {
  id: number;
  annualCost() { return this.salary; }
}
```

---

## API Refactoring

### Separate Query from Modifier

**When:** A function returns a value and has side effects.

```javascript
// Before
function getTotalAndSendBill() {
  const total = calculateTotal();
  sendBill(total);
  return total;
}

// After
function getTotal() {
  return calculateTotal();
}

function sendBill() {
  const total = getTotal();
  // send bill logic
}

// Usage
const total = getTotal();
sendBill();
```

### Replace Parameter with Method

**When:** Parameter can be obtained by calling a method.

```javascript
// Before
const basePrice = quantity * itemPrice;
const discountLevel = getDiscountLevel();
const finalPrice = discountedPrice(basePrice, discountLevel);

// After
const basePrice = quantity * itemPrice;
const finalPrice = discountedPrice(basePrice);

function discountedPrice(basePrice) {
  const discountLevel = getDiscountLevel(); // Get it inside
  // calculation
}
```

### Preserve Whole Object

**When:** Passing several values from an object as parameters.

```javascript
// Before
const low = room.daysTempRange.low;
const high = room.daysTempRange.high;
const isWithinRange = plan.withinRange(low, high);

// After
const isWithinRange = plan.withinRange(room.daysTempRange);
```
