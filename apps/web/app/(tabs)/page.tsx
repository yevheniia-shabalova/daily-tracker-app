import { sampleTrackers, getCompletionRate, getBestStreak, getTodayCompleted } from '@daily-tracker/core'
import { TrackerCard } from '@/components/tracker-card'
import { StatCard } from '@/components/stat-card'
import { ThemeToggle } from '@/components/theme-toggle'

export default function HomePage() {
  const trackers = sampleTrackers
  const completed = getTodayCompleted(trackers)
  const completionRate = getCompletionRate(trackers)
  const bestStreak = getBestStreak(trackers)

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Daily tracker</p>
          <h1>Stay consistent without making your day feel crowded.</h1>
          <p className="hero-copy">
            Track habits, routines, mood, water, workouts, reading, and custom goals in one calm dashboard.
          </p>
        </div>
        <ThemeToggle />
      </section>

      <section className="stats-grid">
        <StatCard label="Done today" value={`${completed}/${trackers.length}`} helper="Tracked habits completed" />
        <StatCard label="Completion" value={`${completionRate}%`} helper="Today across all trackers" />
        <StatCard label="Best streak" value={`${bestStreak} days`} helper="Highest active streak" />
      </section>

      <section className="section-head">
        <div>
          <p className="eyebrow">Today</p>
          <h2>Your active trackers</h2>
        </div>
      </section>

      <section className="tracker-grid">
        {trackers.map((tracker) => (
          <TrackerCard key={tracker.id} tracker={tracker} />
        ))}
      </section>
    </main>
  )
}
