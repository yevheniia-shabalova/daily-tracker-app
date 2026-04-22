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
