import Button from "../common/Button.jsx";

export default function StockReceiptItemRow({
  item,
  products,
  index,
  onChange,
  onRemove,
  canRemove,
}) {
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
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name} · {product.stockQuantity} in stock
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Quantity</label>
        <input
          required
          min="1"
          step="1"
          type="number"
          value={item.quantity}
          onChange={(event) =>
            onChange(index, { ...item, quantity: event.target.value })
          }
        />
      </div>
      <div className="field">
        <label>Cost price</label>
        <input
          required
          min="0"
          step="0.01"
          type="number"
          value={item.costPrice}
          onChange={(event) =>
            onChange(index, { ...item, costPrice: event.target.value })
          }
        />
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
