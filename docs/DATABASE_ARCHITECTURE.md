# Database Layer Documentation

## Overview

The Daily Tracker app uses an abstraction layer for data persistence, allowing flexible switching between different database implementations. Currently, **IndexedDB** is implemented for browser-based storage.

## Architecture

### Database Interface (`IDatabase`)

The core abstraction is defined in `lib/db/types.ts` and provides a consistent API for all database implementations:

```typescript
interface IDatabase {
  // Initialization
  init(): Promise<void>
  
  // Habits CRUD
  getHabits(): Promise<Tracker[]>
  addHabit(habit: Tracker): Promise<void>
  updateHabit(id: string, updates: Partial<Tracker>): Promise<void>
  deleteHabit(id: string): Promise<void>
  
  // Categories
  getCategories(): Promise<TrackerCategory[]>
  setCategories(categories: TrackerCategory[]): Promise<void>
  
  // Completions
  getCompletions(): Promise<Record<string, Record<string, boolean>>>
  updateCompletion(date: string, habitId: string, completed: boolean): Promise<void>
  deleteCompletionsForHabit(habitId: string): Promise<void>
  
  // Cleanup
  clear(): Promise<void>
}
```

### Current Implementation: IndexedDB

Located in `lib/db/indexeddb.ts`, the `IndexedDBDatabase` class implements the `IDatabase` interface using browser IndexedDB.

**Key Features:**
- Persistent storage in the browser
- Structured storage with separate object stores for habits, categories, and completions
- Singleton instance managed by `getDatabase()`
- Full CRUD operations for all data types

## Usage

### In React Components

The app uses the `useHabits()` hook from `components/habits-context.tsx` to access data:

```typescript
import { useHabits } from '@/components/habits-context'

export function MyComponent() {
  const { habits, categories, addHabit, updateHabit } = useHabits()
  
  // Use the data and methods here
}
```

The `HabitsProvider` component automatically:
1. Initializes the database on mount
2. Loads existing data from IndexedDB
3. Saves any state changes back to IndexedDB

## Migrating to a Different Database

### Step 1: Create a New Implementation

Create a new file in `lib/db/` (e.g., `firestore.ts`) implementing the `IDatabase` interface:

```typescript
import type { IDatabase } from './types'

export class FirestoreDatabase implements IDatabase {
  async init(): Promise<void> {
    // Initialize Firestore connection
  }

  async getHabits(): Promise<Tracker[]> {
    // Fetch from Firestore
  }

  // ... implement all interface methods
}
```

### Step 2: Create a Factory Function

Add a factory function to export your implementation:

```typescript
export async function getDatabase(): Promise<FirestoreDatabase> {
  if (!dbInstance) {
    dbInstance = new FirestoreDatabase()
    await dbInstance.init()
  }
  return dbInstance
}
```

### Step 3: Update Exports

Update `lib/db/index.ts` to export the new implementation:

```typescript
export { FirestoreDatabase, getDatabase } from './firestore'
```

### Step 4: No Changes Needed Elsewhere

Because the entire app uses the `IDatabase` interface and the `useHabits()` hook, **no changes are needed in components or other parts of the application**. The database switch is seamless!

## Data Structure

### Habits Store
Stores `Tracker` objects with the following structure:
```typescript
type Tracker = {
  id: string
  name: string
  category: TrackerCategory
  unit: string
  targetPerDay: number
  completedToday: number
  streak: number
}
```

### Categories Store
Stores an array of category names:
```typescript
type TrackerCategory = 'Health' | 'Mind' | 'Fitness' | 'Lifestyle'
```

### Completions Store
Stores a nested record of completion status by date and habit ID:
```typescript
type Completions = Record<string, Record<string, boolean>>
// Example: { "2024-04-23": { "habit-id-1": true, "habit-id-2": false } }
```

## Benefits of This Architecture

✅ **Abstraction**: Components don't know about database implementation details
✅ **Testability**: Easy to mock the `IDatabase` interface for testing
✅ **Flexibility**: Switch databases without touching component code
✅ **Scalability**: Can upgrade from IndexedDB to cloud databases as needed
✅ **Maintainability**: Changes to database logic are isolated to `lib/db/`

## Error Handling

All database operations include error handling:

```typescript
try {
  const habits = await db.getHabits()
} catch (error) {
  console.error('Failed to fetch habits:', error)
}
```

The app gracefully falls back to component state if database operations fail.

## Future Considerations

When migrating to a production database:

1. **Authentication**: Add user authentication for Firestore, PostgreSQL, etc.
2. **Data Validation**: Implement server-side validation
3. **Offline Sync**: Consider offline support if migrating to cloud databases
4. **Performance**: Audit indexes and query patterns for production loads
5. **Data Migration**: Plan data migration from IndexedDB to new backend
