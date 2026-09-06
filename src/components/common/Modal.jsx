export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="overlay">
      <div
        className="card"
        role="dialog"
        aria-modal="true"
        style={{ maxWidth: 720, margin: "8vh auto" }}
      >
        <div className="split">
          <h2>{title}</h2>
          <button className="button secondary" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
