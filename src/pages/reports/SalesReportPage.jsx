import { useEffect, useState } from "react";
import Button from "../../components/common/Button.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_URL } from "../../config/env.js";

export default function SalesReportPage() {
  const { token } = useAuth();
  const [filters, setFilters] = useState({ from: "", to: "" });
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      const params = new URLSearchParams();
      if (filters.from) params.set("from", filters.from);
      if (filters.to) params.set("to", filters.to);
      const response = await fetch(`${API_URL}/reports/sales?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to load sales report");
      setData(result);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  useEffect(() => {
    load();
  }, [token]);
  const total = (data?.totals || []).reduce(
    (sum, row) => sum + Number(row.sales || 0),
    0,
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Sales report</h1>
          <p>Actual order totals, statuses and top-selling products.</p>
        </div>
      </div>
      <ErrorMessage message={error} />
      <div className="toolbar">
        <input
          type="date"
          value={filters.from}
          onChange={(event) =>
            setFilters({ ...filters, from: event.target.value })
          }
        />
        <input
          type="date"
          value={filters.to}
          onChange={(event) =>
            setFilters({ ...filters, to: event.target.value })
          }
        />
        <Button onClick={load}>Apply date range</Button>
      </div>
      {!data && !error ? (
        <LoadingSpinner />
      ) : (
        data && (
          <>
            <div className="grid grid-2">
              <div className="card">
                <span className="muted">Total sales</span>
                <div className="report-total">Rs {total.toLocaleString()}</div>
              </div>
              <div className="card">
                <span className="muted">Completed orders</span>
                <div className="report-total">{data.completedOrders}</div>
              </div>
            </div>
            <div className="grid grid-2" style={{ marginTop: 16 }}>
              <section className="card">
                <h2>Orders by status</h2>
                <ul className="list">
                  {data.totals.length ? (
                    data.totals.map((row) => (
                      <li className="list-item" key={row._id}>
                        <span>{row._id}</span>
                        <strong>
                          {row.orders} · Rs {Number(row.sales).toLocaleString()}
                        </strong>
                      </li>
                    ))
                  ) : (
                    <li className="muted">No sales in this range.</li>
                  )}
                </ul>
              </section>
              <section className="card">
                <h2>Top-selling products</h2>
                <ul className="list">
                  {data.topSelling.length ? (
                    data.topSelling.map((row) => (
                      <li className="list-item" key={row._id}>
                        <span>{row.product.name}</span>
                        <strong>{row.quantity} units</strong>
                      </li>
                    ))
                  ) : (
                    <li className="muted">No product sales in this range.</li>
                  )}
                </ul>
              </section>
            </div>
          </>
        )
      )}
    </>
  );
}
