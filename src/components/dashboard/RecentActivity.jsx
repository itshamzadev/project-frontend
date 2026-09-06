export default function RecentActivity({ orders }) {
  return (
    <ul className="list">
      {orders.length ? (
        orders.map((order) => (
          <li className="list-item" key={order._id}>
            <span>
              <strong>{order.orderNo}</strong>
              <br />
              <small className="muted">
                {order.customer?.name || "Customer"}
              </small>
            </span>
            <span className="muted">{order.status}</span>
          </li>
        ))
      ) : (
        <li className="muted">No recent order activity.</li>
      )}
    </ul>
  );
}
