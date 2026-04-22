import { ScrollView, Text, View, StyleSheet } from 'react-native'
import { sampleTrackers, getCompletionRate } from '@daily-tracker/core'

export default function TodayScreen() {
  const completion = getCompletionRate(sampleTrackers)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>Daily tracker</Text>
      <Text style={styles.title}>A calm place to check off your day.</Text>
      <View style={styles.heroCard}>
        <Text style={styles.heroMetric}>{completion}%</Text>
        <Text style={styles.heroHelper}>Completed today</Text>
      </View>

      {sampleTrackers.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardMeta}>{item.completedToday}/{item.targetPerDay} {item.unit}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.streak}d</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16, backgroundColor: '#f7f6f2' },
  eyebrow: { textTransform: 'uppercase', letterSpacing: 2, color: '#0f766e', fontWeight: '700', fontSize: 12 },
  title: { fontSize: 34, lineHeight: 36, fontWeight: '800', color: '#1f1d1a' },
  heroCard: { backgroundColor: '#0f766e', borderRadius: 24, padding: 20 },
  heroMetric: { color: '#fff', fontWeight: '800', fontSize: 36 },
  heroHelper: { color: 'rgba(255,255,255,0.85)', marginTop: 6 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 18 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1f1d1a' },
  cardMeta: { marginTop: 4, color: '#6d675f' },
  badge: { backgroundColor: '#dff3f1', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  badgeText: { color: '#0f766e', fontWeight: '700' }
})
