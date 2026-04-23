'use client'

import { sampleTrackers } from '@daily-tracker/core'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CalendarPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const router = useRouter()
  const trackers = sampleTrackers

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const getDaysArray = () => {
    const days = []
    const first = firstDayOfMonth(selectedMonth)
    const days_count = daysInMonth(selectedMonth)
    
    // Empty cells for days before month starts
    for (let i = 0; i < first; i++) {
      days.push(null)
    }
    
    // Days of the month
    for (let i = 1; i <= days_count; i++) {
      days.push(i)
    }
    
    return days
  }

  const calculateCompletionPercentage = (day: number | null): number => {
    if (!day) return 0
    // Simple calculation: random for demo, in production would query actual data
    return Math.floor(Math.random() * 100)
  }

  const getCompletionColor = (percentage: number): string => {
    if (percentage === 0) return 'transparent'
    if (percentage < 30) return '#ff4757'
    if (percentage < 60) return '#ffa502'
    if (percentage < 100) return '#2ed573'
    return '#1e90ff'
  }

  const handleDayClick = (day: number | null) => {
    if (!day) return
    const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day)
    const dateString = date.toISOString().split('T')[0]
    router.push(`/habits?date=${dateString}`)
  }

  const handlePrevMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))
  }

  const monthName = selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })
  const days = getDaysArray()
  const weeks = Math.ceil(days.length / 7)

  return (
    <main className="page-shell">
      <section className="section-head">
        <p className="eyebrow">Calendar view</p>
        <h1>Habit visualization</h1>
        <p className="hero-copy">See your habits and streaks across the month.</p>
      </section>

      <section className="calendar-section">
        <div className="calendar-header">
          <button onClick={handlePrevMonth} className="calendar-nav">←</button>
          <h2 className="calendar-month">{monthName}</h2>
          <button onClick={handleNextMonth} className="calendar-nav">→</button>
        </div>

        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-days">
            {days.map((day, idx) => {
              const completion = calculateCompletionPercentage(day)
              const completionColor = getCompletionColor(completion)
              return (
                <div
                  key={idx}
                  className={`calendar-day ${day ? 'active' : 'empty'} ${day === new Date().getDate() ? 'today' : ''}`}
                  onClick={() => handleDayClick(day)}
                  style={day ? {
                    borderWidth: '3px',
                    borderStyle: 'solid',
                    borderColor: completionColor,
                    cursor: 'pointer',
                    position: 'relative'
                  } : {}}
                  title={day ? `${completion}% complete` : ''}
                >
                  {day}
                  {day && completion > 0 && (
                    <span className="completion-badge" style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      backgroundColor: completionColor,
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {completion}%
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="habits-overview">
          <p className="eyebrow">Habits tracked this month</p>
          <div className="habits-mini-list">
            {trackers.map((tracker) => (
              <div key={tracker.id} className="habit-mini">
                <span className="habit-mini-name">{tracker.name}</span>
                <span className="habit-mini-streak">{tracker.streak} day streak</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
