export default function Modal({ title, children, onClose }) {
  return (
    <div className="card" role="dialog" aria-modal="true">
      <div className="page-header">
        <h2>{title}</h2>
        <button className="btn secondary" type="button" onClick={onClose}>Close</button>
      </div>
      {children}
    </div>
  );
}
