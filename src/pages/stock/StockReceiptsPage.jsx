import { useEffect, useState } from "react";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import Table from "../../components/common/Table.jsx";
import StockReceiptForm from "../../components/stock/StockReceiptForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_URL } from "../../config/env.js";
const today = () => new Date().toISOString().slice(0, 10);
const blank = () => ({
  referenceNo: "",
  supplierName: "",
  receivedAt: today(),
  items: [{ product: "", quantity: 1, costPrice: 0 }],
});

export default function StockReceiptsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 0 });
  const [filters, setFilters] = useState({
    search: "",
    supplier: "",
    referenceNo: "",
    from: "",
    to: "",
  });
  const [form, setForm] = useState(blank());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function load(page = 1, nextFilters = filters) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      Object.entries(nextFilters).forEach(
        ([key, value]) => value && params.set(key, value),
      );
      const [receiptResponse, productResponse] = await Promise.all([
        fetch(`${API_URL}/stock-receipts?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/products?page=1&limit=100&isActive=true`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const receiptData = await receiptResponse.json();
      const productData = await productResponse.json();
      if (!receiptResponse.ok)
        throw new Error(receiptData.message || "Unable to load receipts");
      if (!productResponse.ok)
        throw new Error(productData.message || "Unable to load products");
      setReceipts(receiptData.data || []);
      setPagination({
        page: receiptData.pagination?.page || 1,
        pages: receiptData.pagination?.pages || 0,
      });
      setProducts(productData.data || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [token]);

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/stock-receipts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to record stock receipt");
      setForm(blank());
      await load(1);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Stock receipts</h1>
          <p>
            Increase stock atomically and record an IN movement for every item.
          </p>
        </div>
      </div>
      <ErrorMessage message={error} />
      <div className="toolbar">
        <input
          placeholder="Search supplier or reference"
          value={filters.search}
          onChange={(event) =>
            setFilters({ ...filters, search: event.target.value })
          }
        />
        <input
          placeholder="Supplier"
          value={filters.supplier}
          onChange={(event) =>
            setFilters({ ...filters, supplier: event.target.value })
          }
        />
        <input
          placeholder="Reference number"
          value={filters.referenceNo}
          onChange={(event) =>
            setFilters({ ...filters, referenceNo: event.target.value })
          }
        />
        <label className="field">
          <span>From</span>
          <input
            type="date"
            value={filters.from}
            onChange={(event) =>
              setFilters({ ...filters, from: event.target.value })
            }
          />
        </label>
        <label className="field">
          <span>To</span>
          <input
            type="date"
            value={filters.to}
            onChange={(event) =>
              setFilters({ ...filters, to: event.target.value })
            }
          />
        </label>
        <button className="button" onClick={() => load(1, filters)}>
          Apply filters
        </button>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : products.length ? (
        <StockReceiptForm
          form={form}
          products={products}
          onChange={setForm}
          onSubmit={submit}
          onCancel={() => setForm(blank())}
          submitting={submitting}
        />
      ) : (
        <section className="card">
          <EmptyState
            title="No active products"
            message="Add an active product before recording stock-in."
          />
        </section>
      )}
      <section className="card" style={{ marginTop: 16, padding: 0 }}>
        {loading ? (
          <LoadingSpinner />
        ) : receipts.length ? (
          <Table headers={["Reference", "Supplier", "Received", "Items", "By"]}>
            {receipts.map((receipt) => (
              <tr key={receipt._id}>
                <td>{receipt.referenceNo}</td>
                <td>{receipt.supplierName}</td>
                <td>{new Date(receipt.receivedAt).toLocaleDateString()}</td>
                <td>{receipt.items.length}</td>
                <td>{receipt.receivedBy?.name || "—"}</td>
              </tr>
            ))}
          </Table>
        ) : (
          <EmptyState
            title="No stock receipts found"
            message="Recorded stock-in transactions will appear here."
          />
        )}
      </section>
      <Pagination
        page={pagination.page}
        pages={pagination.pages}
        onChange={(page) => load(page)}
      />
    </>
  );
}
