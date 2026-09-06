export default function LowStockList({ products }) {
  return (
    <ul className="list">
      {products.length ? (
        products.map((product) => (
          <li className="list-item" key={product._id}>
            <span>
              <strong>{product.name}</strong>
              <br />
              <small className="muted">{product.sku}</small>
            </span>
            <span>
              {product.stockQuantity} / {product.reorderLevel}
            </span>
          </li>
        ))
      ) : (
        <li className="muted">No low-stock products.</li>
      )}
    </ul>
  );
}
