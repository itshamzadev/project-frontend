export default function OrderSummary({ items, products, discount }) {
  const subtotal = items.reduce((sum, item) => {
    const product = products.find((entry) => entry._id === item.product);
    return (
      sum +
      (product ? Number(product.sellingPrice) * Number(item.quantity || 0) : 0)
    );
  }, 0);
  const total = Math.max(0, subtotal - Number(discount || 0));
  return (
    <div className="card">
      <div className="split">
        <span>Subtotal</span>
        <strong>Rs {subtotal.toLocaleString()}</strong>
      </div>
      <div className="split" style={{ marginTop: 8 }}>
        <span>Discount</span>
        <strong>Rs {Number(discount || 0).toLocaleString()}</strong>
      </div>
      <div
        className="split"
        style={{
          marginTop: 14,
          paddingTop: 14,
          borderTop: "1px solid #edf0f4",
        }}
      >
        <span>Total preview</span>
        <strong className="report-total">Rs {total.toLocaleString()}</strong>
      </div>
      <p className="muted" style={{ fontSize: 12 }}>
        Final prices, stock and totals are validated by the server.
      </p>
    </div>
  );
}
