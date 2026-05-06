export default function Pagination({ page = 1, totalPages, onPageChange, disabled }) {
  const isLastPage = totalPages ? page >= totalPages : false;

  return (
    <div className="button-row" style={{ marginTop: 16, justifyContent: "flex-end" }}>
      <button className="btn secondary" type="button" disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)}>Previous</button>
      <span className="badge">Page {page}{totalPages ? ` of ${totalPages}` : ""}</span>
      <button className="btn secondary" type="button" disabled={disabled || isLastPage} onClick={() => onPageChange(page + 1)}>Next</button>
    </div>
  );
}
