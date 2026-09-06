import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import MobileMenu from "../components/layout/MobileMenu.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";

export default function DashboardLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="main-shell">
        <Header onMenu={() => setMenuOpen(true)} />
        <main className="content">{children || <Outlet />}</main>
      </div>
    </div>
  );
}
