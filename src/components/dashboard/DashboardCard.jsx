export default function DashboardCard({ label, value }) {
  return (
    <div className="card stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
