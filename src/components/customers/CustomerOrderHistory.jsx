import StatusBadge from "../common/StatusBadge.jsx";

export default function CustomerOrderHistory({ orders }) {
  return (
    <div className="card">
      <h2>Order history</h2>
      {orders.length ? (
        <ul className="list">
          {orders.map((order) => (
            <li className="list-item" key={order._id}>
              <span>
                <strong>{order.orderNo}</strong>
                <br />
                <small className="muted">
                  {new Date(order.createdAt).toLocaleDateString()}
                </small>
              </span>
              <span>
                <StatusBadge status={order.status} /> Rs{" "}
                {Number(order.total).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">No orders for this customer.</p>
      )}
    </div>
  );
}
