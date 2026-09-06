export default function MobileMenu({ open, onClose }) {
  return open ? (
    <button
      className="overlay"
      aria-label="Close navigation"
      onClick={onClose}
    />
  ) : null;
}
