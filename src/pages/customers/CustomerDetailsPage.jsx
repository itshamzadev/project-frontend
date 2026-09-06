import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CustomerOrderHistory from "../../components/customers/CustomerOrderHistory.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_URL } from "../../config/env.js";

export default function CustomerDetailsPage() {
  const { token } = useAuth();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`${API_URL}/customers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.message || "Unable to load customer");
        setData(result);
      } catch (requestError) {
        setError(requestError.message);
      }
    }
    load();
  }, [id, token]);
  if (error) return <ErrorMessage message={error} />;
  if (!data) return <LoadingSpinner />;
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>{data.customer.name}</h1>
          <p>Customer details and database-backed order history.</p>
        </div>
        <Link className="button secondary" to="/customers">
          Back to customers
        </Link>
      </div>
      <div className="card detail-grid">
        <div>
          <span className="detail-label">Email</span>
          <span className="detail-value">{data.customer.email || "—"}</span>
        </div>
        <div>
          <span className="detail-label">Phone</span>
          <span className="detail-value">{data.customer.phone || "—"}</span>
        </div>
        <div>
          <span className="detail-label">Address</span>
          <span className="detail-value">{data.customer.address || "—"}</span>
        </div>
      </div>
      <CustomerOrderHistory orders={data.orders} />
    </>
  );
}
