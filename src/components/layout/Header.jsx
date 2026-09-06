import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Header({ onMenu }) {
  const { user } = useAuth();
  const location = useLocation();
  const title =
    location.pathname === "/dashboard"
      ? "Dashboard"
      : location.pathname.split("/")[1]?.replace("-", " ") || "Inventory";
  const initials = (user?.name || "User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <header className="topbar">
      <div className="header-left">
        <button
          className="mobile-menu-button"
          onClick={onMenu}
          aria-label="Open navigation"
        >
          Menu
        </button>
        <div>
          <h1>{title.charAt(0).toUpperCase() + title.slice(1)}</h1>
          <p>Inventory, sales orders and stock control</p>
        </div>
      </div>
      <div className="header-actions">
        <div className="user-chip">
          <span className="user-avatar" aria-hidden="true">{initials}</span>
          <span>{user?.name}</span>
        </div>
      </div>
    </header>
  );
}
