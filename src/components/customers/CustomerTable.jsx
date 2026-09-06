import { Link } from "react-router-dom";
import Button from "../common/Button.jsx";
import EmptyState from "../common/EmptyState.jsx";
import Table from "../common/Table.jsx";

export default function CustomerTable({ customers, onEdit, onDelete }) {
  if (!customers.length)
    return (
      <div className="card">
        <EmptyState
          title="No customers found"
          message="Try a different search or add a customer."
        />
      </div>
    );
  return (
    <Table headers={["Name", "Email", "Phone", "Address", "Actions"]}>
      {customers.map((customer) => (
        <tr key={customer._id}>
          <td>
            <Link to={`/customers/${customer._id}`}>{customer.name}</Link>
          </td>
          <td>{customer.email || "—"}</td>
          <td>{customer.phone || "—"}</td>
          <td>{customer.address || "—"}</td>
          <td>
            <div className="row-actions">
              <Button
                className="small"
                variant="secondary"
                onClick={() => onEdit(customer)}
              >
                Edit
              </Button>
              <Link
                className="button secondary small"
                to={`/customers/${customer._id}`}
              >
                History
              </Link>
              <Button
                className="small"
                variant="danger"
                onClick={() => onDelete(customer._id)}
              >
                Delete
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </Table>
  );
}
