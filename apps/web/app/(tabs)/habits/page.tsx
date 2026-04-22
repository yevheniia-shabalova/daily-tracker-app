import { sampleTrackers } from '@daily-tracker/core'

export default function HabitsPage() {
  const trackers = sampleTrackers

  return (
    <main className="page-shell">
      <section className="section-head">
        <p className="eyebrow">Your habits</p>
        <h1>All tracked habits</h1>
        <p className="hero-copy">Complete view of all your habits and their current streaks.</p>
      </section>

      <section className="habits-list">
        {trackers.map((tracker) => (
          <div key={tracker.id} className="habit-item">
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
          </div>
        ))}
      </section>
    </main>
  )
}
