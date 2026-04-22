'use client'

import { sampleTrackers } from '@daily-tracker/core'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function HabitsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dateParam = searchParams.get('date')
  
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (dateParam) {
      return new Date(dateParam)
    }
    return new Date()
  })

  // Generate mock data for a specific date to show different values for different days
  const getDataForDate = (date: Date): Record<string, boolean> => {
    const dateString = date.toISOString().split('T')[0]
    // Use date as seed for consistent but different data per date
    const dateHash = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    
    return {
      water: (dateHash % 3) === 0,
      walk: (dateHash % 4) === 1,
      read: (dateHash % 5) === 2,
      journal: (dateHash % 7) === 3,
    }
  }

  const trackers = sampleTrackers
  const [completedHabits, setCompletedHabits] = useState<Record<string, boolean>>(
    getDataForDate(selectedDate)
  )

  useEffect(() => {
    if (dateParam) {
      const newDate = new Date(dateParam)
      setSelectedDate(newDate)
      setCompletedHabits(getDataForDate(newDate))
    } else {
      // Reset to today when no date parameter
      const today = new Date()
      setSelectedDate(today)
      setCompletedHabits(getDataForDate(today))
    }
  }, [dateParam])

  const toggleHabit = (habitId: string) => {
    setCompletedHabits((prev) => ({
      ...prev,
      [habitId]: !prev[habitId],
    }))
  }

  const calculateCompletionPercentage = (): number => {
    const completed = Object.values(completedHabits).filter(Boolean).length
    return Math.round((completed / trackers.length) * 100)
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
          {Object.values(completedHabits).filter(Boolean).length} of {trackers.length} completed
        </p>
      </section>

      <section className="habits-list">
        {trackers.map((tracker) => {
          const isCompleted = completedHabits[tracker.id]
          
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
              <label htmlFor={`habit-${tracker.id}`} className="habit-label">
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
        })}
      </section>
    </main>
  )
}
