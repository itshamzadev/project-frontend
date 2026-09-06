import Button from "../common/Button.jsx";
import FormField from "../common/FormField.jsx";
import StockReceiptItemRow from "./StockReceiptItemRow.jsx";

export default function StockReceiptForm({
  form,
  products,
  onChange,
  onSubmit,
  onCancel,
  submitting,
}) {
  function changeItem(index, value) {
    onChange({
      ...form,
      items: form.items.map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    });
  }
  function removeItem(index) {
    if (form.items.length > 1)
      onChange({
        ...form,
        items: form.items.filter((_, itemIndex) => itemIndex !== index),
      });
  }
  return (
    <form className="card form-stack" onSubmit={onSubmit}>
      <div className="form-grid">
        <FormField label="Supplier name" required>
          <input
            required
            value={form.supplierName}
            onChange={(event) =>
              onChange({ ...form, supplierName: event.target.value })
            }
          />
        </FormField>
        <FormField label="Reference number" required>
          <input
            required
            value={form.referenceNo}
            onChange={(event) =>
              onChange({ ...form, referenceNo: event.target.value })
            }
          />
        </FormField>
        <FormField label="Received date" required>
          <input
            required
            type="date"
            value={form.receivedAt}
            onChange={(event) =>
              onChange({ ...form, receivedAt: event.target.value })
            }
          />
        </FormField>
      </div>
      <div className="split">
        <h2>Received products</h2>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            onChange({
              ...form,
              items: [
                ...form.items,
                { product: "", quantity: 1, costPrice: 0 },
              ],
            })
          }
        >
          Add item
        </Button>
      </div>
      <div className="order-lines">
        {form.items.map((item, index) => (
          <StockReceiptItemRow
            key={index}
            item={item}
            products={products}
            index={index}
            onChange={changeItem}
            onRemove={removeItem}
            canRemove={form.items.length > 1}
          />
        ))}
      </div>
      <div className="form-actions">
        <Button disabled={submitting}>
          {submitting ? "Recording…" : "Record stock in"}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Reset
          </Button>
        )}
      </div>
    </form>
  );
}
