import { useEffect, useState } from "react";
import DashboardCard from "../../components/dashboard/DashboardCard.jsx";
import LowStockList from "../../components/dashboard/LowStockList.jsx";
import OrdersByStatus from "../../components/dashboard/OrdersByStatus.jsx";
import RecentActivity from "../../components/dashboard/RecentActivity.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_URL } from "../../config/env.js";
const money = (value) => `Rs ${Number(value || 0).toLocaleString()}`;

export default function DashboardPage() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`${API_URL}/reports/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.message || "Unable to load dashboard");
        setData(result);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    load();
  }, [token]);

  if (error) {
    return (
      <>
        <div className="page-heading">
          <div>
            <h1>Dashboard</h1>
            <p>Role-relevant operational summary.</p>
          </div>
        </div>
        <ErrorMessage message={error} />
      </>
    );
  }
  if (!data) return <LoadingSpinner />;
  const cards = [
    ["Total products", data.cards.totalProducts],
    ["Low-stock products", data.cards.lowStockProducts],
    ["Total orders", data.cards.totalOrders],
    ["Total sales", money(data.cards.totalSales)],
    ["Draft orders", data.cards.draftOrders],
    ["Confirmed orders", data.cards.confirmedOrders],
    ["Processing orders", data.cards.processingOrders],
    ["Completed orders", data.cards.completedOrders],
  ];

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Real-time inventory and sales overview.</p>
        </div>
      </div>
      <div className="grid grid-4">
        {cards.map(([label, value]) => (
          <DashboardCard key={label} label={label} value={value} />
        ))}
      </div>
      <div className="grid grid-2" style={{ marginTop: 16 }}>
        <section className="card">
          <div className="split">
            <h2>Low stock</h2>
            <span className="muted">Stock / reorder</span>
          </div>
          <LowStockList products={data.lowStock || []} />
        </section>
        <section className="card">
          <div className="split">
            <h2>Orders by status</h2>
          </div>
          <OrdersByStatus statuses={data.byStatus || []} />
        </section>
        <section className="card">
          <div className="split">
            <h2>Recent activity</h2>
          </div>
          <RecentActivity orders={data.recent || []} />
        </section>
      </div>
    </>
  );
}
