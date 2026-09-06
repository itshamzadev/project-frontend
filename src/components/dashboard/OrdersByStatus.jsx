import StatusBadge from "../common/StatusBadge.jsx";

export default function OrdersByStatus({ statuses }) {
  return (
    <ul className="list">
      {statuses.length ? (
        statuses.map((item) => (
          <li className="list-item" key={item._id}>
            <StatusBadge status={item._id} />
            <strong>{item.count}</strong>
          </li>
        ))
      ) : (
        <li className="muted">No orders yet.</li>
      )}
    </ul>
  );
}
