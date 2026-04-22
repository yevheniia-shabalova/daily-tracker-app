import { Text, View, StyleSheet } from 'react-native'

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      <Text style={styles.copy}>Add a month grid, selected day details, and history snapshots here.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f6f2' },
  title: { fontSize: 30, fontWeight: '800', color: '#1f1d1a' },
  copy: { marginTop: 12, color: '#6d675f', fontSize: 16, lineHeight: 24 }
})
