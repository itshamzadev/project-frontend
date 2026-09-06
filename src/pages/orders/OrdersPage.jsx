import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import OrderFilters from "../../components/orders/OrderFilters.jsx";
import OrderTable from "../../components/orders/OrderTable.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_URL } from "../../config/env.js";

export default function OrdersPage() {
  const { token, user } = useAuth();
  const [data, setData] = useState({ items: [], page: 1, pages: 0 });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    cancellationStatus: "",
    from: "",
    to: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load(page = 1, nextFilters = filters) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      Object.entries(nextFilters).forEach(
        ([key, value]) => value && params.set(key, value),
      );
      const response = await fetch(`${API_URL}/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to load orders");
      setData({
        items: result.data || [],
        page: result.pagination?.page || 1,
        pages: result.pagination?.pages || 0,
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [token]);

  async function action(id, type, payload) {
    try {
      const response = await fetch(`${API_URL}/orders/${id}/${type}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: payload ? JSON.stringify(payload) : undefined,
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to update order");
      await load(data.page);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Orders</h1>
          <p>Follow the Draft → Confirmed → Processing → Completed workflow.</p>
        </div>
        {["sales", "admin"].includes(user.role) && (
          <Link className="button" to="/orders/new">
            Create order
          </Link>
        )}
      </div>
      <ErrorMessage message={error} />
      <OrderFilters
        filters={filters}
        role={user.role}
        onChange={setFilters}
        onApply={() => load(1, filters)}
      />
      <section className="card" style={{ padding: 0 }}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <OrderTable orders={data.items} role={user.role} onAction={action} />
        )}
      </section>
      <Pagination page={data.page} pages={data.pages} onChange={load} />
    </>
  );
}
