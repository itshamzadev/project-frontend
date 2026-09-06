import Button from "../common/Button.jsx";
import FormField from "../common/FormField.jsx";

export default function UserForm({ form, onChange, onSubmit, submitting }) {
  return (
    <form className="card form-grid" onSubmit={onSubmit}>
      <FormField label="Name" required>
        <input
          required
          value={form.name}
          onChange={(event) => onChange({ ...form, name: event.target.value })}
        />
      </FormField>
      <FormField label="Email" required>
        <input
          required
          type="email"
          value={form.email}
          onChange={(event) => onChange({ ...form, email: event.target.value })}
        />
      </FormField>
      <FormField label="Password" required>
        <input
          required
          minLength="6"
          type="password"
          value={form.password}
          onChange={(event) =>
            onChange({ ...form, password: event.target.value })
          }
        />
      </FormField>
      <FormField label="Role" required>
        <select
          value={form.role}
          onChange={(event) => onChange({ ...form, role: event.target.value })}
        >
          <option value="sales">Sales</option>
          <option value="warehouse">Warehouse</option>
          <option value="admin">Admin</option>
        </select>
      </FormField>
      <div className="form-actions" style={{ gridColumn: "1/-1" }}>
        <Button disabled={submitting}>
          {submitting ? "Creating…" : "Create user"}
        </Button>
      </div>
    </form>
  );
}
