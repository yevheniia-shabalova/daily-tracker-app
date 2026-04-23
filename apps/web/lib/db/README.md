# Database Module Guide

## Quick Start

The app automatically uses IndexedDB for data persistence. No configuration needed - just use the `useHabits()` hook in your components.

```typescript
import { useHabits } from '@/components/habits-context'

export function MyComponent() {
  const { habits, addHabit, updateHabit, deleteHabit } = useHabits()
  // Your component code
}
```

## File Structure

```
lib/db/
├── types.ts         # IDatabase interface definition
├── indexeddb.ts     # IndexedDB implementation
└── index.ts         # Exports

components/
└── habits-context.tsx  # React context that manages data
```

## Key Components

### `IDatabase` Interface
Defines the contract that all database implementations must follow. Provides methods for:
- **Habits**: CRUD operations (Create, Read, Update, Delete)
- **Categories**: Get and set tracker categories
- **Completions**: Track habit completion by date
- **Cleanup**: Clear all data (useful for testing)

### `IndexedDBDatabase` Class
Current implementation using browser IndexedDB. Features:
- Automatic initialization on first use
- Separate object stores for better organization
- Error handling and logging
- Singleton pattern (only one instance)

### `HabitsProvider` Component
React context provider that:
- Initializes the database on app load
- Manages all habit/category/completion state
- Syncs state changes to IndexedDB automatically
- Provides the `useHabits()` hook for components

## Data Flow

```
Component
    ↓
useHabits() hook
    ↓
HabitsProvider state
    ↓
IndexedDB (via IDatabase)
    ↓
Browser localStorage (IndexedDB)
```

## Switching Databases

To migrate to a different database (Firebase, PostgreSQL, etc.):

1. Create a new class in `lib/db/yourdb.ts` implementing `IDatabase`
2. Update the exports in `lib/db/index.ts`
3. That's it! No other changes needed.

See `docs/DATABASE_MIGRATION_EXAMPLES.ts` for example implementations.

## Common Operations

### Adding a Habit
```typescript
const { addHabit } = useHabits()

addHabit({
  name: 'Morning Run',
  category: 'Fitness',
  unit: 'minutes',
  targetPerDay: 30,
})
```

### Updating a Habit
```typescript
const { updateHabit } = useHabits()

updateHabit('habit-id', {
  name: 'Updated Name',
  targetPerDay: 45,
})
```

### Deleting a Habit
```typescript
const { deleteHabit } = useHabits()

deleteHabit('habit-id')
```

### Tracking Completion
```typescript
const { toggleHabitCompletion } = useHabits()

// Toggle completion for today
toggleHabitCompletion('habit-id', '2024-04-23')
```

### Getting Completion Data
```typescript
const { getHabitsForDate } = useHabits()

// Get all habit completions for a specific date
const todayCompletions = getHabitsForDate('2024-04-23')
// Returns: { 'habit-id-1': true, 'habit-id-2': false }
```

## Debugging

Monitor database operations in browser DevTools:

```typescript
// In browser console
const db = await getDatabase()
const habits = await db.getHabits()
console.log(habits)
```

Check IndexedDB contents:
1. Open DevTools → Storage → IndexedDB
2. Look for database named `daily-tracker-db`
3. Inspect `habits`, `categories`, and `completions` stores

## Error Handling

The app includes error handling at multiple levels:

1. **Database level**: Try-catch in storage operations
2. **Context level**: Try-catch when initializing and saving
3. **Component level**: Fallback to component state if database fails

If something goes wrong, you'll see console errors and the app will continue working with in-memory state.

## Best Practices

✅ Always use `useHabits()` for data access - never access IndexedDB directly
✅ Handle errors gracefully in async operations
✅ Use the provided methods rather than manipulating state directly
✅ Keep database logic separated in `lib/db/` for easy testing and migration

## Testing

When writing tests, you can mock the `IDatabase` interface:

```typescript
const mockDb: IDatabase = {
  init: jest.fn().mockResolvedValue(undefined),
  getHabits: jest.fn().mockResolvedValue([]),
  // ... mock other methods
}
```

Then inject it into `HabitsProvider` for testing.
