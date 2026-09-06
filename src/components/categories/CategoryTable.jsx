import Button from "../common/Button.jsx";
import EmptyState from "../common/EmptyState.jsx";
import Table from "../common/Table.jsx";

export default function CategoryTable({ categories, onEdit, onDelete }) {
  if (!categories.length)
    return (
      <div className="card">
        <EmptyState
          title="No categories found"
          message="Add a category to organize products."
        />
      </div>
    );
  return (
    <Table headers={["Name", "Description", "Status", "Actions"]}>
      {categories.map((category) => (
        <tr key={category._id}>
          <td>{category.name}</td>
          <td>{category.description || "—"}</td>
          <td>{category.isActive ? "Active" : "Inactive"}</td>
          <td>
            <div className="row-actions">
              <Button
                className="small"
                variant="secondary"
                onClick={() => onEdit(category)}
              >
                Edit
              </Button>
              <Button
                className="small"
                variant="danger"
                onClick={() => onDelete(category._id)}
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
