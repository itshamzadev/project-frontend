import Button from "./Button.jsx";

export default function ConfirmDialog({
  open,
  title = "Confirm action",
  message,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  return (
    <div className="overlay" role="presentation">
      <div
        className="card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        style={{ maxWidth: 420, margin: "18vh auto" }}
      >
        <h2 id="confirm-title">{title}</h2>
        <p className="muted">{message}</p>
        <div className="form-actions">
          <Button variant="danger" onClick={onConfirm}>
            Confirm
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Keep
          </Button>
        </div>
      </div>
    </div>
  );
}
