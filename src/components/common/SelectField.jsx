export default function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
}) {
  return (
    <div className="field">
      <label>
        {label}
        {required ? " *" : ""}
      </label>
      <select required={required} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
