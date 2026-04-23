import type { Tracker, TrackerCategory } from '@daily-tracker/core'
import type { IDatabase } from './types'

const DB_NAME = 'daily-tracker-db'
const DB_VERSION = 1

// Store names
const HABITS_STORE = 'habits'
const CATEGORIES_STORE = 'categories'
const COMPLETIONS_STORE = 'completions'

/**
 * IndexedDB implementation of the database abstraction
 * Provides persistent storage in the browser using IndexedDB
 */
export class IndexedDBDatabase implements IDatabase {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains(HABITS_STORE)) {
          db.createObjectStore(HABITS_STORE, { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains(CATEGORIES_STORE)) {
          db.createObjectStore(CATEGORIES_STORE)
        }

        if (!db.objectStoreNames.contains(COMPLETIONS_STORE)) {
          db.createObjectStore(COMPLETIONS_STORE)
        }
      }
    })
  }

  private ensureDb(): IDBDatabase {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.')
    }
    return this.db
  }

  // Habits
  async getHabits(): Promise<Tracker[]> {
    const db = this.ensureDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([HABITS_STORE], 'readonly')
      const store = transaction.objectStore(HABITS_STORE)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result as Tracker[])
    })
  }

  async addHabit(habit: Tracker): Promise<void> {
    const db = this.ensureDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([HABITS_STORE], 'readwrite')
      const store = transaction.objectStore(HABITS_STORE)
      const request = store.add(habit)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async updateHabit(id: string, updates: Partial<Tracker>): Promise<void> {
    const db = this.ensureDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([HABITS_STORE], 'readwrite')
      const store = transaction.objectStore(HABITS_STORE)
      const getRequest = store.get(id)

      getRequest.onerror = () => reject(getRequest.error)
      getRequest.onsuccess = () => {
        const habit = getRequest.result as Tracker
        const updated = { ...habit, ...updates }
        const updateRequest = store.put(updated)

        updateRequest.onerror = () => reject(updateRequest.error)
        updateRequest.onsuccess = () => resolve()
      }
    })
  }

  async deleteHabit(id: string): Promise<void> {
    const db = this.ensureDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([HABITS_STORE], 'readwrite')
      const store = transaction.objectStore(HABITS_STORE)
      const request = store.delete(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  // Categories
  async getCategories(): Promise<TrackerCategory[]> {
    const db = this.ensureDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CATEGORIES_STORE], 'readonly')
      const store = transaction.objectStore(CATEGORIES_STORE)
      const request = store.get('categories')

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const result = request.result as TrackerCategory[] | undefined
        resolve(result || ['Health', 'Mind', 'Fitness', 'Lifestyle'])
      }
    })
  }

  async setCategories(categories: TrackerCategory[]): Promise<void> {
    const db = this.ensureDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CATEGORIES_STORE], 'readwrite')
      const store = transaction.objectStore(CATEGORIES_STORE)
      const request = store.put(categories, 'categories')

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  // Completions
  async getCompletions(): Promise<Record<string, Record<string, boolean>>> {
    const db = this.ensureDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([COMPLETIONS_STORE], 'readonly')
      const store = transaction.objectStore(COMPLETIONS_STORE)
      const request = store.get('completions')

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const result = request.result as Record<string, Record<string, boolean>> | undefined
        resolve(result || {})
      }
    })
  }

  async updateCompletion(date: string, habitId: string, completed: boolean): Promise<void> {
    const db = this.ensureDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([COMPLETIONS_STORE], 'readwrite')
      const store = transaction.objectStore(COMPLETIONS_STORE)
      const getRequest = store.get('completions')

      getRequest.onerror = () => reject(getRequest.error)
      getRequest.onsuccess = () => {
        const completions = getRequest.result as Record<string, Record<string, boolean>> || {}
        completions[date] = completions[date] || {}
        completions[date][habitId] = completed

        const putRequest = store.put(completions, 'completions')
        putRequest.onerror = () => reject(putRequest.error)
        putRequest.onsuccess = () => resolve()
      }
    })
  }

  async deleteCompletionsForHabit(habitId: string): Promise<void> {
    const db = this.ensureDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([COMPLETIONS_STORE], 'readwrite')
      const store = transaction.objectStore(COMPLETIONS_STORE)
      const getRequest = store.get('completions')

      getRequest.onerror = () => reject(getRequest.error)
      getRequest.onsuccess = () => {
        const completions = getRequest.result as Record<string, Record<string, boolean>> || {}
        Object.keys(completions).forEach(date => {
          delete completions[date][habitId]
        })

        const putRequest = store.put(completions, 'completions')
        putRequest.onerror = () => reject(putRequest.error)
        putRequest.onsuccess = () => resolve()
      }
    })
  }

  // Cleanup
  async clear(): Promise<void> {
    const db = this.ensureDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        [HABITS_STORE, CATEGORIES_STORE, COMPLETIONS_STORE],
        'readwrite'
      )

      const habitsRequest = transaction.objectStore(HABITS_STORE).clear()
      const categoriesRequest = transaction.objectStore(CATEGORIES_STORE).clear()
      const completionsRequest = transaction.objectStore(COMPLETIONS_STORE).clear()

      transaction.onerror = () => reject(transaction.error)
      transaction.oncomplete = () => resolve()
    })
  }
}

// Singleton instance
let dbInstance: IndexedDBDatabase | null = null

/**
 * Get or create the IndexedDB database instance
 */
export async function getDatabase(): Promise<IndexedDBDatabase> {
  if (!dbInstance) {
    dbInstance = new IndexedDBDatabase()
    await dbInstance.init()
  }
  return dbInstance
}
