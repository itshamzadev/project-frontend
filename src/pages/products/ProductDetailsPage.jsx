import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_URL } from "../../config/env.js";

export default function ProductDetailsPage() {
  const { token } = useAuth();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.message || "Unable to load product");
        setProduct(result);
      } catch (requestError) {
        setError(requestError.message);
      }
    }
    load();
  }, [id, token]);
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <LoadingSpinner />;
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>{product.name}</h1>
          <p>Product detail</p>
        </div>
        <Link className="button secondary" to="/products">
          Back to products
        </Link>
      </div>
      <div className="card detail-grid">
        <div>
          <span className="detail-label">SKU</span>
          <span className="detail-value">{product.sku}</span>
        </div>
        <div>
          <span className="detail-label">Category</span>
          <span className="detail-value">{product.category?.name || "—"}</span>
        </div>
        <div>
          <span className="detail-label">Selling price</span>
          <span className="detail-value">
            Rs {Number(product.sellingPrice).toLocaleString()}
          </span>
        </div>
        <div>
          <span className="detail-label">Current stock</span>
          <span className="detail-value">{product.stockQuantity}</span>
        </div>
        <div>
          <span className="detail-label">Reorder level</span>
          <span className="detail-value">{product.reorderLevel}</span>
        </div>
        <div>
          <span className="detail-label">Status</span>
          <span className="detail-value">
            {product.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </>
  );
}
