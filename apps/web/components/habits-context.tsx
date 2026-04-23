'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Tracker, TrackerCategory } from '@daily-tracker/core'

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
  const [habits, setHabits] = useState<Tracker[]>([])
  const [categories, setCategories] = useState<TrackerCategory[]>(['Health', 'Mind', 'Fitness', 'Lifestyle'])
  const [completions, setCompletions] = useState<Record<string, Record<string, boolean>>>({})

  // Load from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('daily-tracker-habits')
    const savedCategories = localStorage.getItem('daily-tracker-categories')
    const savedCompletions = localStorage.getItem('daily-tracker-completions')

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits))
    } else {
      // Initialize with sample data if no saved data
      import('@daily-tracker/core').then(({ sampleTrackers }) => {
        setHabits(sampleTrackers)
      })
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    }

    if (savedCompletions) {
      setCompletions(JSON.parse(savedCompletions))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('daily-tracker-habits', JSON.stringify(habits))
  }, [habits])

  useEffect(() => {
    localStorage.setItem('daily-tracker-categories', JSON.stringify(categories))
  }, [categories])

  useEffect(() => {
    localStorage.setItem('daily-tracker-completions', JSON.stringify(completions))
  }, [completions])

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