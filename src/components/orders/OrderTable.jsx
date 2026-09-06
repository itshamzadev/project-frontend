import { Link } from "react-router-dom";
import EmptyState from "../common/EmptyState.jsx";
import StatusBadge from "../common/StatusBadge.jsx";
import Table from "../common/Table.jsx";
import OrderStatusActions from "./OrderStatusActions.jsx";

export default function OrderTable({ orders, role, onAction }) {
  if (!orders.length)
    return (
      <div className="card">
        <EmptyState
          title="No orders found"
          message="Draft orders created by your team will appear here."
        />
      </div>
    );
  return (
    <Table
      headers={["Order", "Customer", "Date", "Total", "Status", "Actions"]}
    >
      {orders.map((order) => (
        <tr key={order._id}>
          <td>
            <Link to={`/orders/${order._id}`}>{order.orderNo}</Link>
          </td>
          <td>{order.customer?.name || "—"}</td>
          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
          <td>Rs {Number(order.total).toLocaleString()}</td>
          <td>
            <StatusBadge status={order.status} />
            {order.cancellation?.status === "Pending" && (
              <small className="muted">Cancellation pending</small>
            )}
          </td>
          <td>
            <div className="row-actions">
              <Link
                className="button secondary small"
                to={`/orders/${order._id}`}
              >
                Details
              </Link>
              {order.status === "Draft" &&
                ["sales", "admin"].includes(role) && (
                  <Link
                    className="button secondary small"
                    to={`/orders/${order._id}/edit`}
                  >
                    Edit
                  </Link>
                )}
              <OrderStatusActions
                order={order}
                role={role}
                onAction={(type, payload) => onAction(order._id, type, payload)}
              />
            </div>
          </td>
        </tr>
      ))}
    </Table>
  );
}
