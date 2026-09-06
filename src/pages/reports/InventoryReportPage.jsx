import { useEffect, useState } from "react";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import Table from "../../components/common/Table.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_URL } from "../../config/env.js";

export default function InventoryReportPage() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`${API_URL}/reports/inventory`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.message || "Unable to load inventory report");
        setData(result);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    load();
  }, [token]);
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Inventory report</h1>
          <p>Current stock, low-stock items and out-of-stock products.</p>
        </div>
      </div>
      <ErrorMessage message={error} />
      {!data && !error ? (
        <LoadingSpinner />
      ) : (
        data && (
          <>
            <div className="grid grid-2">
              <div className="card">
                <span className="muted">Active products</span>
                <div className="report-total">{data.totalProducts}</div>
              </div>
              <div className="card">
                <span className="muted">Total stock quantity</span>
                <div className="report-total">{data.totalStockQuantity}</div>
              </div>
            </div>
            <section className="card" style={{ marginTop: 16, padding: 0 }}>
              <Table
                headers={[
                  "SKU",
                  "Product",
                  "Category",
                  "Current stock",
                  "Reorder level",
                ]}
              >
                {data.lowStock.length ? (
                  data.lowStock.map((product) => (
                    <tr key={product._id}>
                      <td>{product.sku}</td>
                      <td>{product.name}</td>
                      <td>{product.category?.name || "—"}</td>
                      <td>{product.stockQuantity}</td>
                      <td>{product.reorderLevel}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No low-stock products.</td>
                  </tr>
                )}
              </Table>
            </section>
            <div className="notice" style={{ marginTop: 16 }}>
              Out-of-stock products: {data.outOfStock.length}
            </div>
          </>
        )
      )}
    </>
  );
}
