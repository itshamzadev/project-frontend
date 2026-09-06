import Button from "../common/Button.jsx";

export default function OrderItemRow({
  item,
  products,
  index,
  onChange,
  onRemove,
  canRemove,
}) {
  const product = products.find((entry) => entry._id === item.product);
  const subtotal = product
    ? Number(product.sellingPrice) * Number(item.quantity || 0)
    : 0;
  return (
    <div className="order-line">
      <div className="field">
        <label>Product</label>
        <select
          required
          value={item.product}
          onChange={(event) =>
            onChange(index, { ...item, product: event.target.value })
          }
        >
          <option value="">Choose product</option>
          {products.map((entry) => (
            <option key={entry._id} value={entry._id}>
              {entry.name} · {entry.stockQuantity} in stock
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Quantity</label>
        <input
          required
          min="1"
          max={product ? product.stockQuantity : undefined}
          step="1"
          type="number"
          value={item.quantity}
          onChange={(event) =>
            onChange(index, { ...item, quantity: event.target.value })
          }
        />
      </div>
      <div className="line-total">
        <span className="detail-label">Unit price</span>Rs{" "}
        {Number(product?.sellingPrice || 0).toLocaleString()}
      </div>
      <div className="line-total">
        <span className="detail-label">Subtotal</span>Rs{" "}
        {subtotal.toLocaleString()}
      </div>
      <Button
        type="button"
        variant="danger"
        className="small"
        disabled={!canRemove}
        onClick={() => onRemove(index)}
      >
        Remove
      </Button>
    </div>
  );
}
