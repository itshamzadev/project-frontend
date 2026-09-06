export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button
      className={`button ${variant === "danger" ? "danger" : variant === "secondary" ? "secondary" : variant === "success" ? "success" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
