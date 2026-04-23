import type { Tracker, TrackerCategory } from '@daily-tracker/core'

/**
 * Database abstraction interface
 * Allows easy migration to different database solutions (Firestore, PostgreSQL, etc.)
 */
export interface IDatabase {
  // Initialization
  init(): Promise<void>
  
  // Habits
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
