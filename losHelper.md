# CRUD

### 1. Define the objects used in the program

- Decide which objects exist
- Decide which properties each object has
- Decide which property is an array of other objects

---

### 2. Define where the objects are stored

- Decide which array holds all main objects
- Decide the starting value of that array
- Decide if this array is accessible outside the file or not

---

### 3. Define how to find one object in the array

- Decide how to search the array using an id
- Decide what happens if the object is not found
- Decide what the function returns

---

### 4. Define how to create a new main object

- Decide how to generate a new id
- Decide how to build the new object from parameters
- Decide how to add it to the array
- Decide what the function returns

---

### 5. Define how to create a nested object

- Decide how to find the parent object first
- Decide what happens if the parent doesn’t exist
- Decide how to generate a new id for the nested object
- Decide how to add it to the parent’s array
- Decide what the function returns

---

### 6. Define how to delete a nested object

- Decide how to find the parent object
- Decide how to find the nested object index
- Decide what happens if one is missing
- Decide how to remove it from the array
- Decide what the function returns

---

### 7. Define how to update a nested object

- Decide how to find the parent object
- Decide how to find the nested object itself
- Decide what happens if one is missing
- Decide which properties are changed
- Decide what the function returns

---

### 8. Define what this file exposes

- Decide which functions are exported
- Decide which arrays or objects stay private

---

# Validation

> &rarr; Input Validation (CLI)
>
> _Stop wrong user input early (empty strings, negative numbers, invalid dates)._
> <br><br>
> &rarr; Business-rule validation (service)
>
> _Protect your data even if CLI changes (no duplicate >trips, activity time rules, etc.)._

## 1. Decide your rules (write them down first)

### Trip rules (minimum)

- destination: required, trimmed, length > 1
- startDate: must be a valid date
- optional: startDate not in the past (only if your assignment wants it)

### Activity rules (minimum)

- name: required, trimmed
- cost: number, cost >= 0
- category: must be one of food | transport | sightseeing
- startTime: valid date/time
- business rule option: activity time must be on/after trip start date
- business rule option: activity time must be within the trip period (if you implement end date later)

> ✅ When you have a short bullet list in your README / notes (even 6 lines).

## 2. Create a tiny validation toolbox (pure functions)

> 🧠 Create src/shared/validation.ts (or src/shared/validators.ts).

#### Implement these pure helpers:

```js
isNonEmptyString(value: string): boolean

parseNonEmptyString(value: string): string (returns trimmed string or throws)

parseNonNegativeNumber(value: string): number (from CLI input string)

parseDate(value: string): Date (throws if invalid)
```

> ⚠️ CLI inputs are strings. Your validators should convert them into safe typed values.

> ✅ When you can run a quick node script or temporary console logs and see:

- " Paris " becomes "Paris"
- "-3" throws for cost
- "not a date" throws

## 3. Add CLI validation (Inquirer validate)

Your CLI is your first gate.

#### For each prompt:

- use validate: (input) => true | "error message"
- for numbers, still validate as string, then parse later

#### Examples of what you validate in prompts:

### Trip creation

- destination prompt: reject empty
- startDate prompt: reject invalid date format

### Add activity

- name: reject empty
- cost: reject NaN / negative
- category: don’t validate manually if you use list choices (it becomes impossible to be invalid)
- startTime: reject invalid date/time

> ✅ When in the CLI you cannot proceed unless input is valid, and the error message is friendly.

## 4. Add service-level validation (protect your data)

#### Even if CLI validation exists, your service must still validate, because:

- teammates might call your functions differently
- you might add tests later
- CLI prompts might change
- In your itineraryService.ts (or whatever file holds the CRUD logic), add checks:

### Trip create

- destination trimmed not empty
- startDate valid
- business rule: prevent duplicate trip IDs (if user picks ID) or auto-generate

### Add activity to trip

- verify trip exists (by id)
- validate activity fields again (name/cost/category/startTime)
- business rule: activity.startTime >= trip.startDate

#### Implementation pattern:

- Throw Error with clear messages (or custom ValidationError if you want extra polish).

> ✅ When if you bypass CLI (call the function manually) it still refuses invalid data.

## 5. Standardize error handling (one way everywhere)

#### Pick one consistent style:

### Option A (simplest)

- services throw errors
- CLI catches errors and prints message, then returns to menu

#### Pseudo-flow:

```js
try { await action() }
catch (err) { print error; pause; }
```

> ✅ When any validation error doesn’t crash the app, it just shows message and returns to menu.

## 6. Validation for “view/filter/sort” features

### Once CRUD is safe, validate feature inputs too:

#### View activities for a specific day

- user picks a date → validate date
- normalize comparison (same day) using a consistent approach (e.g., compare YYYY-MM-DD strings)

#### Filter by category

- best: use list prompt → no invalid input possible

#### High-cost threshold

- validate threshold is a number >= 0

> ✅ When these features don’t behave weirdly if user types junk.
