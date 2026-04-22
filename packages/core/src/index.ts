export type TrackerCategory = 'Health' | 'Mind' | 'Fitness' | 'Lifestyle'

export type Tracker = {
  id: string
  name: string
  category: TrackerCategory
  unit: string
  targetPerDay: number
  completedToday: number
  streak: number
}

export const sampleTrackers: Tracker[] = [
  { id: 'water', name: 'Drink Water', category: 'Health', unit: 'glasses', targetPerDay: 8, completedToday: 5, streak: 6 },
  { id: 'walk', name: 'Walk', category: 'Fitness', unit: 'minutes', targetPerDay: 30, completedToday: 20, streak: 4 },
  { id: 'read', name: 'Read', category: 'Mind', unit: 'minutes', targetPerDay: 20, completedToday: 20, streak: 11 },
  { id: 'journal', name: 'Journal', category: 'Lifestyle', unit: 'entry', targetPerDay: 1, completedToday: 1, streak: 9 }
]

export function getTodayCompleted(trackers: Tracker[]) {
  return trackers.filter((tracker) => tracker.completedToday >= tracker.targetPerDay).length
}

export function getCompletionRate(trackers: Tracker[]) {
  return Math.round((getTodayCompleted(trackers) / trackers.length) * 100)
}

export function getBestStreak(trackers: Tracker[]) {
  return trackers.reduce((max, tracker) => Math.max(max, tracker.streak), 0)
}

export function getMostCheckedHabit(trackers: Tracker[]): Tracker | null {
  if (trackers.length === 0) return null
  return trackers.reduce((max, tracker) => 
    tracker.streak > max.streak ? tracker : max
  )
}

export function getLeastCheckedHabit(trackers: Tracker[]): Tracker | null {
  if (trackers.length === 0) return null
  return trackers.reduce((min, tracker) => 
    tracker.streak < min.streak ? tracker : min
  )
}

export function getTrendDirection(trackers: Tracker[]): 'up' | 'down' | 'neutral' {
  if (trackers.length === 0) return 'neutral'
  // Calculate trend: if average streak is increasing (more streak = more consistent = improving)
  const averageStreak = trackers.reduce((sum, t) => sum + t.streak, 0) / trackers.length
  const completedHabits = getTodayCompleted(trackers)
  
  // If completion rate is high and average streak is good, trending up
  if (completedHabits >= trackers.length * 0.75 && averageStreak >= 7) {
    return 'up'
  }
  // If completion rate is low or strokes are low, trending down
  else if (completedHabits <= trackers.length * 0.25 || averageStreak <= 3) {
    return 'down'
  }
  return 'neutral'
}
