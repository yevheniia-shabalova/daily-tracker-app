import { Text, View, StyleSheet } from 'react-native'
import { sampleTrackers, getBestStreak } from '@daily-tracker/core'

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stats</Text>
      <Text style={styles.metric}>{getBestStreak(sampleTrackers)} day streak</Text>
      <Text style={styles.copy}>Extend this screen with weekly charts, consistency rate, and category breakdowns.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f6f2' },
  title: { fontSize: 30, fontWeight: '800', color: '#1f1d1a' },
  metric: { marginTop: 16, fontSize: 38, fontWeight: '800', color: '#0f766e' },
  copy: { marginTop: 12, color: '#6d675f', fontSize: 16, lineHeight: 24 }
})
