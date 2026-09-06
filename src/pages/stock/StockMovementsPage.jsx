import { useEffect, useState } from "react";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import StockMovementTable from "../../components/stock/StockMovementTable.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_URL } from "../../config/env.js";

export default function StockMovementsPage() {
  const { token } = useAuth();
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load(page = 1) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 25 });
      if (type) params.set("type", type);
      const response = await fetch(`${API_URL}/stock-movements?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to load movements");
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

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Stock movements</h1>
          <p>Audit every inventory change with its before and after balance.</p>
        </div>
      </div>
      <ErrorMessage message={error} />
      <div className="toolbar">
        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="">All movement types</option>
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
          <option value="ADJUSTMENT">ADJUSTMENT</option>
        </select>
        <button className="button" onClick={() => load(1)}>
          Apply
        </button>
      </div>
      <section className="card" style={{ padding: 0 }}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <StockMovementTable movements={data.items} />
        )}
      </section>
      <Pagination page={data.page} pages={data.pages} onChange={load} />
    </>
  );
}
