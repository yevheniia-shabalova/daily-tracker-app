'use client'

import { sampleTrackers } from '@daily-tracker/core'
import { useState } from 'react'

export default function CalendarPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date())
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
            {days.map((day, idx) => (
              <div
                key={idx}
                className={`calendar-day ${day ? 'active' : 'empty'} ${day === new Date().getDate() ? 'today' : ''}`}
              >
                {day}
              </div>
            ))}
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
