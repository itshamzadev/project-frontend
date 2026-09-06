import Button from "../common/Button.jsx";
import FormField from "../common/FormField.jsx";

export default function CustomerForm({
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
      <FormField label="Email">
        <input
          type="email"
          value={form.email}
          onChange={(event) => onChange({ ...form, email: event.target.value })}
        />
      </FormField>
      <FormField label="Phone">
        <input
          value={form.phone}
          onChange={(event) => onChange({ ...form, phone: event.target.value })}
        />
      </FormField>
      <FormField label="Address">
        <textarea
          value={form.address}
          onChange={(event) =>
            onChange({ ...form, address: event.target.value })
          }
        />
      </FormField>
      <div className="form-actions" style={{ gridColumn: "1/-1" }}>
        <Button disabled={submitting}>
          {submitting
            ? "Saving…"
            : editing
              ? "Update customer"
              : "Add customer"}
        </Button>
        {editing && (
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
