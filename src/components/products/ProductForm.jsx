import Button from "../common/Button.jsx";
import FormField from "../common/FormField.jsx";

export default function ProductForm({
  form,
  categories,
  editing,
  onChange,
  onSubmit,
  onCancel,
  submitting,
}) {
  return (
    <form className="card form-grid" onSubmit={onSubmit}>
      <FormField label="SKU" required>
        <input
          required
          value={form.sku}
          onChange={(event) => onChange({ ...form, sku: event.target.value })}
        />
      </FormField>
      <FormField label="Name" required>
        <input
          required
          value={form.name}
          onChange={(event) => onChange({ ...form, name: event.target.value })}
        />
      </FormField>
      <FormField label="Category" required>
        <select
          required
          value={form.category}
          onChange={(event) =>
            onChange({ ...form, category: event.target.value })
          }
        >
          <option value="">Choose category</option>
          {categories.map((category) => (
            <option value={category._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Selling price" required>
        <input
          required
          type="number"
          min="0"
          step="0.01"
          value={form.sellingPrice}
          onChange={(event) =>
            onChange({ ...form, sellingPrice: event.target.value })
          }
        />
      </FormField>
      <FormField label="Reorder level" required>
        <input
          required
          type="number"
          min="0"
          step="1"
          value={form.reorderLevel}
          onChange={(event) =>
            onChange({ ...form, reorderLevel: event.target.value })
          }
        />
      </FormField>
      <FormField label="Status">
        <select
          value={String(form.isActive)}
          onChange={(event) =>
            onChange({ ...form, isActive: event.target.value === "true" })
          }
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </FormField>
      <div className="form-actions" style={{ gridColumn: "1/-1" }}>
        <Button disabled={submitting}>
          {submitting ? "Saving…" : editing ? "Update product" : "Add product"}
        </Button>
        {editing && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
