'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Tracker, TrackerCategory } from '@daily-tracker/core'
import { getDatabase } from '../lib/db'
import type { IDatabase } from '../lib/db'

interface HabitsContextType {
  habits: Tracker[]
  categories: TrackerCategory[]
  addHabit: (habit: Omit<Tracker, 'id'>) => void
  updateHabit: (id: string, habit: Partial<Tracker>) => void
  deleteHabit: (id: string) => void
  addCategory: (category: TrackerCategory) => void
  updateCategory: (oldCategory: TrackerCategory, newCategory: TrackerCategory) => void
  deleteCategory: (category: TrackerCategory) => void
  toggleHabitCompletion: (id: string, date: string) => void
  getHabitsForDate: (date: string) => Record<string, boolean>
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined)

export function useHabits() {
  const context = useContext(HabitsContext)
  if (!context) {
    throw new Error('useHabits must be used within a HabitsProvider')
  }
  return context
}

interface HabitsProviderProps {
  children: ReactNode
}

export function HabitsProvider({ children }: HabitsProviderProps) {
  const [db, setDb] = useState<IDatabase | null>(null)
  const [habits, setHabits] = useState<Tracker[]>([])
  const [categories, setCategories] = useState<TrackerCategory[]>(['Health', 'Mind', 'Fitness', 'Lifestyle'])
  const [completions, setCompletions] = useState<Record<string, Record<string, boolean>>>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize database and load data on mount
  useEffect(() => {
    const initializeDB = async () => {
      try {
        const database = await getDatabase()
        setDb(database)

        // Load habits
        const savedHabits = await database.getHabits()
        setHabits(savedHabits)

        // Load categories
        const savedCategories = await database.getCategories()
        setCategories(savedCategories)

        // Load completions
        const savedCompletions = await database.getCompletions()
        setCompletions(savedCompletions)

        setIsLoaded(true)
      } catch (error) {
        console.error('Failed to initialize database:', error)
        setIsLoaded(true)
      }
    }

    initializeDB()
  }, [])

  // Save habits to database whenever they change
  useEffect(() => {
    if (!db || !isLoaded) return

    const saveHabits = async () => {
      try {
        // Clear existing habits and save new ones
        const existingHabits = await db.getHabits()
        for (const habit of existingHabits) {
          if (!habits.find(h => h.id === habit.id)) {
            await db.deleteHabit(habit.id)
          }
        }

        for (const habit of habits) {
          const existing = existingHabits.find(h => h.id === habit.id)
          if (existing) {
            await db.updateHabit(habit.id, habit)
          } else {
            await db.addHabit(habit)
          }
        }
      } catch (error) {
        console.error('Failed to save habits:', error)
      }
    }

    saveHabits()
  }, [habits, db, isLoaded])

  // Save categories to database whenever they change
  useEffect(() => {
    if (!db || !isLoaded) return

    const saveCategories = async () => {
      try {
        await db.setCategories(categories)
      } catch (error) {
        console.error('Failed to save categories:', error)
      }
    }

    saveCategories()
  }, [categories, db, isLoaded])

  // Save completions to database whenever they change
  useEffect(() => {
    if (!db || !isLoaded) return

    const saveCompletions = async () => {
      try {
        // Get existing completions and compare
        const existingCompletions = await db.getCompletions()
        
        // Update changed completions
        for (const [date, dateCompletions] of Object.entries(completions)) {
          for (const [habitId, completed] of Object.entries(dateCompletions)) {
            await db.updateCompletion(date, habitId, completed)
          }
        }

        // Remove completions for deleted habits
        for (const [date, dateCompletions] of Object.entries(existingCompletions)) {
          for (const habitId of Object.keys(dateCompletions)) {
            if (!habits.find(h => h.id === habitId)) {
              await db.deleteCompletionsForHabit(habitId)
            }
          }
        }
      } catch (error) {
        console.error('Failed to save completions:', error)
      }
    }

    saveCompletions()
  }, [completions, db, isLoaded, habits])

  const addHabit = (habitData: Omit<Tracker, 'id'>) => {
    const newHabit: Tracker = {
      ...habitData,
      id: Date.now().toString(),
      completedToday: 0,
      streak: 0,
    }
    setHabits(prev => [...prev, newHabit])
  }

  const updateHabit = (id: string, updates: Partial<Tracker>) => {
    setHabits(prev => prev.map(habit =>
      habit.id === id ? { ...habit, ...updates } : habit
    ))
  }

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id))
    // Also remove completions for this habit
    setCompletions(prev => {
      const newCompletions = { ...prev }
      Object.keys(newCompletions).forEach(date => {
        delete newCompletions[date][id]
      })
      return newCompletions
    })
    
    // Delete from database
    if (db) {
      db.deleteCompletionsForHabit(id).catch(error => {
        console.error('Failed to delete habit completions from database:', error)
      })
    }
  }

  const addCategory = (category: TrackerCategory) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category])
    }
  }

  const updateCategory = (oldCategory: TrackerCategory, newCategory: TrackerCategory) => {
    setCategories(prev => prev.map(cat => cat === oldCategory ? newCategory : cat))
    // Update habits that use this category
    setHabits(prev => prev.map(habit =>
      habit.category === oldCategory ? { ...habit, category: newCategory } : habit
    ))
  }

  const deleteCategory = (category: TrackerCategory) => {
    setCategories(prev => prev.filter(cat => cat !== category))
    // Remove habits in this category
    setHabits(prev => prev.filter(habit => habit.category !== category))
  }

  const toggleHabitCompletion = (id: string, date: string) => {
    setCompletions(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [id]: !prev[date]?.[id]
      }
    }))
  }

  const getHabitsForDate = (date: string): Record<string, boolean> => {
    return completions[date] || {}
  }

  const value: HabitsContextType = {
    habits,
    categories,
    addHabit,
    updateHabit,
    deleteHabit,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleHabitCompletion,
    getHabitsForDate,
  }

  return (
    <HabitsContext.Provider value={value}>
      {children}
    </HabitsContext.Provider>
  )
}