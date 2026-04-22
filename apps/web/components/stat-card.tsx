export function StatCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <article className="card stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <span>{helper}</span>
    </article>
  )
}
