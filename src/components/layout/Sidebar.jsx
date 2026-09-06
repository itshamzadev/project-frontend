import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const iconPaths = {
  dashboard: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  products: "M4 5.5 12 2l8 3.5v13L12 22l-8-3.5z M4 5.5 12 9l8-3.5 M12 9v13",
  categories: "M12 3v18 M3 12h18 M5 5h14v14H5z",
  customers: "M16 20c0-2.2-1.8-4-4-4s-4 1.8-4 4 M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6 M19 20v-1a3 3 0 0 0-2-2.8 M17 6.2a3 3 0 0 1 0 5.6",
  orders: "M5 4h14v16H5z M8 8h8 M8 12h8 M8 16h5",
  create: "M12 5v14 M5 12h14",
  receipts: "M4 5h16v14H4z M8 5v14 M12 9h5 M12 13h5",
  movements: "M5 7h14 M5 12h9 M5 17h14 M17 10l2 2-2 2",
  sales: "M4 19V5 M4 19h16 M8 15l3-4 3 2 5-7",
  inventory: "M4 4h16v16H4z M8 16v-5 M12 16V7 M16 16v-3",
  users: "M16 20c0-2.2-1.8-4-4-4s-4 1.8-4 4 M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6 M19 20v-2a3 3 0 0 0-2-2.8",
};

function NavIcon({ name }) {
  return (
    <span className="nav-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d={iconPaths[name]} />
      </svg>
    </span>
  );
}

export default function Sidebar({ open, onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = [
    ["/dashboard", "Dashboard", true, "dashboard"],
    ["/products", "Products", true, "products"],
    ["/categories", "Categories", user?.role === "admin", "categories"],
    ["/customers", "Customers", ["sales", "admin"].includes(user?.role), "customers"],
    ["/orders", "Orders", true, "orders"],
    ["/orders/new", "Create order", ["sales", "admin"].includes(user?.role), "create"],
    [
      "/stock-receipts",
      "Stock receipts",
      ["warehouse", "admin"].includes(user?.role),
      "receipts",
    ],
    [
      "/stock-movements",
      "Stock movements",
      ["warehouse", "admin"].includes(user?.role),
      "movements",
    ],
    ["/reports/sales", "Sales report", user?.role === "admin", "sales"],
    ["/reports/inventory", "Inventory report", user?.role === "admin", "inventory"],
    ["/users", "Users", user?.role === "admin", "users"],
  ];
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <NavLink className="brand" to="/dashboard" onClick={onNavigate}>
        Inventory Suite
      </NavLink>
      <div className="side-user">
        <strong>{user?.name}</strong>
        <span>{user?.role} staff</span>
      </div>
      <nav className="nav-list">
        {links
          .filter((link) => link[2])
          .map(([to, label, , icon]) => (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <NavIcon name={icon} />
              {label}
            </NavLink>
          ))}
      </nav>
      <button
        className="logout-button"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Log out
      </button>
    </aside>
  );
}
