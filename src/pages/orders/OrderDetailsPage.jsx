import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import Table from "../../components/common/Table.jsx";
import OrderStatusActions from "../../components/orders/OrderStatusActions.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_URL } from "../../config/env.js";

export default function OrderDetailsPage() {
  const { token, user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      const response = await fetch(`${API_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to load order");
      setOrder(result);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  useEffect(() => {
    load();
  }, [id, token]);

  async function action(type, payload) {
    try {
      const response = await fetch(`${API_URL}/orders/${id}/${type}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: payload ? JSON.stringify(payload) : undefined,
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to update order");
      setOrder(result);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (error && !order) return <ErrorMessage message={error} />;
  if (!order) return <LoadingSpinner />;
  const cancellation = order.cancellation;
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>{order.orderNo}</h1>
          <p>Sales order details and workflow controls.</p>
        </div>
        <div className="row-actions">
          <Link className="button secondary" to="/orders">
            Back to orders
          </Link>
          {order.status === "Draft" &&
            ["sales", "admin"].includes(user.role) && (
              <Button
                variant="secondary"
                onClick={() => navigate(`/orders/${id}/edit`)}
              >
                Edit draft
              </Button>
            )}
          <OrderStatusActions
            order={order}
            role={user.role}
            onAction={action}
          />
        </div>
      </div>
      <ErrorMessage message={error} />
      <section className="card detail-grid">
        <div>
          <span className="detail-label">Customer</span>
          <span className="detail-value">{order.customer?.name}</span>
        </div>
        <div>
          <span className="detail-label">Created by</span>
          <span className="detail-value">{order.createdBy?.name || "—"}</span>
        </div>
        <div>
          <span className="detail-label">Status</span>
          <StatusBadge status={order.status} />
        </div>
      </section>
      {cancellation?.status && cancellation.status !== "None" && (
        <section className="card" style={{ marginTop: 16 }}>
          <h2>Cancellation request</h2>
          <p>
            <strong>Status:</strong> {cancellation.status}
          </p>
          <p>
            <strong>Reason:</strong> {cancellation.reason || "—"}
          </p>
          {cancellation.reviewNote && (
            <p>
              <strong>Review note:</strong> {cancellation.reviewNote}
            </p>
          )}
        </section>
      )}
      <section className="card" style={{ marginTop: 16 }}>
        <Table headers={["Product", "Quantity", "Unit price", "Subtotal"]}>
          {order.items.map((item) => (
            <tr key={item.product?._id}>
              <td>{item.product?.name || "Removed product"}</td>
              <td>{item.quantity}</td>
              <td>Rs {Number(item.unitPrice).toLocaleString()}</td>
              <td>Rs {Number(item.subtotal).toLocaleString()}</td>
            </tr>
          ))}
        </Table>
        <div style={{ marginTop: 18, marginLeft: "auto", maxWidth: 300 }}>
          <div className="split">
            <span>Subtotal</span>
            <strong>Rs {Number(order.subtotal).toLocaleString()}</strong>
          </div>
          <div className="split">
            <span>Discount</span>
            <strong>Rs {Number(order.discount).toLocaleString()}</strong>
          </div>
          <div
            className="split"
            style={{
              marginTop: 10,
              paddingTop: 10,
              borderTop: "1px solid #edf0f4",
            }}
          >
            <span>Total</span>
            <strong className="report-total">
              Rs {Number(order.total).toLocaleString()}
            </strong>
          </div>
        </div>
      </section>
    </>
  );
}
