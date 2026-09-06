import Button from "./Button.jsx";

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Search",
}) {
  return (
    <div className="toolbar">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        onKeyDown={(event) => event.key === "Enter" && onSubmit()}
      />
      <Button onClick={onSubmit}>Search</Button>
    </div>
  );
}
