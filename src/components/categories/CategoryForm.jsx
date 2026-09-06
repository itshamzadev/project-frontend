import Button from "../common/Button.jsx";
import FormField from "../common/FormField.jsx";

export default function CategoryForm({
  form,
  editing,
  onChange,
  onSubmit,
  onCancel,
  submitting,
}) {
  return (
    <form className="card form-grid" onSubmit={onSubmit}>
      <FormField label="Name" required>
        <input
          required
          value={form.name}
          onChange={(event) => onChange({ ...form, name: event.target.value })}
        />
      </FormField>
      <FormField label="Description">
        <textarea
          value={form.description}
          onChange={(event) =>
            onChange({ ...form, description: event.target.value })
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
          {submitting
            ? "Saving…"
            : editing
              ? "Update category"
              : "Add category"}
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
