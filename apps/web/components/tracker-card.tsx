import type { Tracker } from '@daily-tracker/core'

export function TrackerCard({ tracker }: { tracker: Tracker }) {
  const progress = Math.round((tracker.completedToday / tracker.targetPerDay) * 100)

  return (
    <article className="card tracker-card">
      <div className="tracker-top">
        <div>
          <p className="eyebrow">{tracker.category}</p>
          <h3 className="tracker-title">{tracker.name}</h3>
          <p className="tracker-meta">{tracker.completedToday}/{tracker.targetPerDay} {tracker.unit} today</p>
        </div>
        <span className="badge">{tracker.streak} day streak</span>
      </div>

      <div className="progress-row">
        <span className="tracker-helper">Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="progress" aria-hidden="true">
        <div style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
    </article>
  )
}
