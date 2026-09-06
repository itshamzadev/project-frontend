import EmptyState from "../common/EmptyState.jsx";
import Table from "../common/Table.jsx";

export default function StockMovementTable({ movements }) {
  if (!movements.length)
    return (
      <div className="card">
        <EmptyState
          title="No stock movements"
          message="Receipts and confirmed orders will create movements here."
        />
      </div>
    );
  return (
    <Table
      headers={[
        "Product",
        "Type",
        "Quantity",
        "Previous",
        "New",
        "Reference",
        "Created by",
        "Date",
      ]}
    >
      {movements.map((movement) => (
        <tr key={movement._id}>
          <td>{movement.product?.name || "—"}</td>
          <td>{movement.type}</td>
          <td>{movement.quantity}</td>
          <td>{movement.previousStock}</td>
          <td>{movement.newStock}</td>
          <td>{movement.referenceType}</td>
          <td>{movement.createdBy?.name || "—"}</td>
          <td>{new Date(movement.createdAt).toLocaleString()}</td>
        </tr>
      ))}
    </Table>
  );
}
