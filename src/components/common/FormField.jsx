export default function FormField({ label, children, required = false }) {
  return (
    <div className="field">
      <label>
        {label}
        {required ? " *" : ""}
      </label>
      {children}
    </div>
  );
}
