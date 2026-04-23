'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useHabits } from '@/components/habits-context'
import { Modal } from '@/components/modal'
import { HabitForm } from '@/components/habit-form'
import { CategoryManager } from '@/components/category-manager'
import type { Tracker } from '@daily-tracker/core'

export default function HabitsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { habits, toggleHabitCompletion, getHabitsForDate } = useHabits()
  const dateParam = searchParams.get('date')

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (dateParam) {
      return new Date(dateParam)
    }
    return new Date()
  })

  const [completedHabits, setCompletedHabits] = useState<Record<string, boolean>>(
    getHabitsForDate(selectedDate.toISOString().split('T')[0])
  )

  const [showHabitModal, setShowHabitModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Tracker | undefined>()

  useEffect(() => {
    if (dateParam) {
      const newDate = new Date(dateParam)
      setSelectedDate(newDate)
      setCompletedHabits(getHabitsForDate(newDate.toISOString().split('T')[0]))
    } else {
      // Reset to today when no date parameter
      const today = new Date()
      setSelectedDate(today)
      setCompletedHabits(getHabitsForDate(today.toISOString().split('T')[0]))
    }
  }, [dateParam, getHabitsForDate])

  const toggleHabit = (habitId: string) => {
    const dateKey = selectedDate.toISOString().split('T')[0]
    toggleHabitCompletion(habitId, dateKey)
    setCompletedHabits(prev => ({
      ...prev,
      [habitId]: !prev[habitId],
    }))
  }

  const calculateCompletionPercentage = (): number => {
    if (habits.length === 0) return 0
    const completed = Object.values(completedHabits).filter(Boolean).length
    return Math.round((completed / habits.length) * 100)
  }

  const getFormattedDate = (): string => {
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isToday = selectedDate.toDateString() === new Date().toDateString()

  const goBackToToday = () => {
    router.push('/habits')
  }

  const handleAddHabit = () => {
    setEditingHabit(undefined)
    setShowHabitModal(true)
  }

  const handleEditHabit = (habit: Tracker) => {
    setEditingHabit(habit)
    setShowHabitModal(true)
  }

  const handleCloseModal = () => {
    setShowHabitModal(false)
    setShowCategoryModal(false)
    setEditingHabit(undefined)
  }

  return (
    <main className="page-shell">
      <section className="section-head">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p className="eyebrow">Your habits</p>
            <h1>All tracked habits</h1>
            <p className="date-display" style={{
              fontSize: '14px',
              color: '#666',
              marginTop: '8px',
              fontWeight: '500'
            }}>
              {getFormattedDate()}
              {isToday && <span style={{ marginLeft: '8px', color: '#1e90ff' }}>(Today)</span>}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <button
              onClick={() => setShowCategoryModal(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4b5563'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6b7280'
              }}
            >
              Manage Labels
            </button>
            <button
              onClick={handleAddHabit}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1e90ff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0070cc'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1e90ff'
              }}
            >
              Add Habit
            </button>
            {!isToday && (
              <button
                onClick={goBackToToday}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1e90ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  marginTop: '4px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0070cc'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e90ff'
                }}
              >
                Back to Today
              </button>
            )}
          </div>
        </div>
        <p className="hero-copy">Check off habits. Visit Calendar to select a different day.</p>
      </section>

      <section className="completion-overview" style={{
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
          {isToday ? "TODAY'S PROGRESS" : "PROGRESS FOR THIS DAY"}
        </p>
        <div style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#1e90ff'
        }}>
          {calculateCompletionPercentage()}%
        </div>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
          {Object.values(completedHabits).filter(Boolean).length} of {habits.length} completed
        </p>
      </section>

      <section className="habits-list">
        {habits.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--muted)',
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius)',
          }}>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>No habits yet</p>
            <p style={{ marginBottom: '20px' }}>Create your first habit to start tracking your daily progress.</p>
            <button
              onClick={handleAddHabit}
              style={{
                padding: '12px 24px',
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
              }}
            >
              Add Your First Habit
            </button>
          </div>
        ) : (
          habits.map((tracker) => {
            const isCompleted = completedHabits[tracker.id] || false

            return (
              <div key={tracker.id} className={`habit-item ${isCompleted ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  id={`habit-${tracker.id}`}
                  checked={isCompleted}
                  onChange={() => toggleHabit(tracker.id)}
                  className="habit-checkbox"
                  aria-label={`Mark ${tracker.name} as completed`}
                />
                <label
                  htmlFor={`habit-${tracker.id}`}
                  className="habit-label"
                  onClick={() => handleEditHabit(tracker)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="habit-info">
                    <p className="eyebrow">{tracker.category}</p>
                    <h3 className="habit-title">{tracker.name}</h3>
                    <p className="habit-meta">Target: {tracker.targetPerDay} {tracker.unit} per day</p>
                  </div>
                  <div className="habit-stats">
                    <div className="stat-box">
                      <span className="stat-label">Streak</span>
                      <span className="stat-value">{tracker.streak}</span>
                      <span className="stat-unit">days</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Completed</span>
                      <span className="stat-value">{tracker.completedToday}</span>
                      <span className="stat-unit">{tracker.unit}</span>
                    </div>
                  </div>
                </label>
              </div>
            )
          })
        )}
      </section>

      <Modal
        isOpen={showHabitModal}
        onClose={handleCloseModal}
        title={editingHabit ? 'Edit Habit' : 'Add New Habit'}
      >
        <HabitForm habit={editingHabit} onClose={handleCloseModal} />
      </Modal>

      <Modal
        isOpen={showCategoryModal}
        onClose={handleCloseModal}
        title="Manage Categories"
      >
        <CategoryManager />
      </Modal>
    </main>
  )
}
