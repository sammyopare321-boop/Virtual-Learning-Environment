export default function Pagination({ page = 1, onPageChange, disabled }) {
  return (
    <div className="button-row" style={{ marginTop: 16, justifyContent: "flex-end" }}>
      <button className="btn secondary" disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)}>Previous</button>
      <span className="badge">Page {page}</span>
      <button className="btn secondary" disabled={disabled} onClick={() => onPageChange(page + 1)}>Next</button>
    </div>
  );
}
