import { Link } from "react-router-dom";
import Button from "../common/Button.jsx";
import EmptyState from "../common/EmptyState.jsx";
import Table from "../common/Table.jsx";

export default function ProductTable({
  products,
  admin,
  onEdit,
  onDeactivate,
}) {
  if (!products.length)
    return (
      <div className="card">
        <EmptyState
          title="No products found"
          message="Try changing the search or filters."
        />
      </div>
    );
  return (
    <Table
      headers={[
        "SKU",
        "Name",
        "Category",
        "Price",
        "Stock",
        "Reorder",
        "Status",
        ...(admin ? ["Actions"] : []),
      ]}
    >
      {products.map((product) => (
        <tr key={product._id}>
          <td>{product.sku}</td>
          <td>
            <Link to={`/products/${product._id}`}>{product.name}</Link>
          </td>
          <td>{product.category?.name || "—"}</td>
          <td>Rs {Number(product.sellingPrice).toLocaleString()}</td>
          <td>{product.stockQuantity}</td>
          <td>{product.reorderLevel}</td>
          <td>{product.isActive ? "Active" : "Inactive"}</td>
          {admin && (
            <td>
              <div className="row-actions">
                <Button
                  className="small"
                  variant="secondary"
                  onClick={() => onEdit(product)}
                >
                  Edit
                </Button>
                {product.isActive && (
                  <Button
                    className="small"
                    variant="danger"
                    onClick={() => onDeactivate(product._id)}
                  >
                    Deactivate
                  </Button>
                )}
              </div>
            </td>
          )}
        </tr>
      ))}
    </Table>
  );
}
