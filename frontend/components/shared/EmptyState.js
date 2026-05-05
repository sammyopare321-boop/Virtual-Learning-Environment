export default function EmptyState({ title = "Nothing here yet", message = "Records will appear here when they are available." }) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p className="muted">{message}</p>
    </div>
  );
}
