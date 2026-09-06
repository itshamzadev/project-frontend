import Button from "../common/Button.jsx";

export default function OrderStatusActions({ order, role, onAction }) {
  const cancellationPending = order.cancellation?.status === "Pending";
  function cancelDraft() {
    if (window.confirm("Cancel this Draft order? No stock will be changed."))
      onAction("cancel");
  }
  function requestCancellation() {
    const reason = window.prompt("Why should this order be cancelled?");
    if (reason?.trim())
      onAction("request-cancellation", { reason: reason.trim() });
  }
  function approveCancellation() {
    if (
      !window.confirm(
        "Approve this cancellation? Stock will be restored in the same transaction.",
      )
    )
      return;
    const reviewNote = window.prompt("Optional review note:") || "";
    onAction("cancellation/approve", { reviewNote });
  }
  function rejectCancellation() {
    const reviewNote = window.prompt("Optional rejection note:") || "";
    onAction("cancellation/reject", { reviewNote });
  }
  return (
    <div className="row-actions">
      {order.status === "Draft" && ["sales", "admin"].includes(role) && (
        <>
          <Button className="small" onClick={() => onAction("confirm")}>
            Confirm
          </Button>
          <Button className="small" variant="danger" onClick={cancelDraft}>
            Cancel order
          </Button>
        </>
      )}
      {order.status === "Confirmed" &&
        ["warehouse", "admin"].includes(role) && (
          <Button
            className="small"
            onClick={() => onAction("status", { status: "Processing" })}
          >
            Move to processing
          </Button>
        )}
      {order.status === "Processing" &&
        ["warehouse", "admin"].includes(role) && (
          <Button
            className="small"
            variant="success"
            onClick={() => onAction("status", { status: "Completed" })}
          >
            Complete
          </Button>
        )}
      {role === "sales" &&
        ["Confirmed", "Processing"].includes(order.status) &&
        !cancellationPending && (
          <Button
            className="small"
            variant="danger"
            onClick={requestCancellation}
          >
            Request cancellation
          </Button>
        )}
      {role === "admin" && cancellationPending && (
        <>
          <Button
            className="small"
            variant="success"
            onClick={approveCancellation}
          >
            Approve cancellation
          </Button>
          <Button
            className="small"
            variant="danger"
            onClick={rejectCancellation}
          >
            Reject cancellation
          </Button>
        </>
      )}
    </div>
  );
}
