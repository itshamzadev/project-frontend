export default function EmptyState({
  title = "No records found",
  message = "There is nothing to display yet.",
}) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  );
}
