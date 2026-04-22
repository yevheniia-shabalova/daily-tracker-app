import { sampleTrackers, getCompletionRate, getBestStreak, getTodayCompleted, getMostCheckedHabit, getLeastCheckedHabit, getTrendDirection } from '@daily-tracker/core'
import { TrackerCard } from '@/components/tracker-card'
import { StatCard } from '@/components/stat-card'
import { ThemeToggle } from '@/components/theme-toggle'

export default function HomePage() {
  const trackers = sampleTrackers
  const completed = getTodayCompleted(trackers)
  const completionRate = getCompletionRate(trackers)
  const bestStreak = getBestStreak(trackers)
  const mostChecked = getMostCheckedHabit(trackers)
  const leastChecked = getLeastCheckedHabit(trackers)
  const trend = getTrendDirection(trackers)

  const getTrendIcon = () => {
    if (trend === 'up') return '📈'
    if (trend === 'down') return '📉'
    return '→'
  }

  const getTrendLabel = () => {
    if (trend === 'up') return 'You\'re improving! 🎉'
    if (trend === 'down') return 'Keep pushing forward 💪'
    return 'You\'re on track'
  }

  const getTrendColor = () => {
    if (trend === 'up') return '#2ed573'
    if (trend === 'down') return '#ff4757'
    return '#ffa502'
  }

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

      <section style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {/* Trend Card */}
          <div style={{
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '12px',
            borderLeft: `4px solid ${getTrendColor()}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ fontSize: '12px', color: '#666', fontWeight: '500', textTransform: 'uppercase' }}>
              Habit Trend
            </div>
            <div style={{ fontSize: '24px' }}>
              {getTrendIcon()}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: getTrendColor() }}>
              {getTrendLabel()}
            </div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              Based on streaks & completion
            </div>
          </div>

          {/* Most Checked Habit */}
          {mostChecked && (
            <div style={{
              padding: '20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '12px',
              borderLeft: '4px solid #1e90ff',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ fontSize: '12px', color: '#666', fontWeight: '500', textTransform: 'uppercase' }}>
                Your Star ⭐
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e90ff' }}>
                {mostChecked.name}
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>
                {mostChecked.streak} day streak - Keep it up!
              </div>
            </div>
          )}

          {/* Least Checked Habit */}
          {leastChecked && (
            <div style={{
              padding: '20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '12px',
              borderLeft: '4px solid #ffa502',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ fontSize: '12px', color: '#666', fontWeight: '500', textTransform: 'uppercase' }}>
                Needs Attention 🎯
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffa502' }}>
                {leastChecked.name}
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>
                {leastChecked.streak} day streak - Time to focus
              </div>
            </div>
          )}
        </div>
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
