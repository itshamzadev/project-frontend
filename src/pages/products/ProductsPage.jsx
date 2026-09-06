import { useEffect, useState } from "react";
import Button from "../../components/common/Button.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import ProductFilters from "../../components/products/ProductFilters.jsx";
import ProductForm from "../../components/products/ProductForm.jsx";
import ProductTable from "../../components/products/ProductTable.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_URL } from "../../config/env.js";
const blank = {
  sku: "",
  name: "",
  category: "",
  sellingPrice: "",
  reorderLevel: 0,
  isActive: true,
};

export default function ProductsPage() {
  const { token, user } = useAuth();
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    isActive: "",
    lowStock: "",
  });
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
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
      const response = await fetch(`${API_URL}/products?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to load products");
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
    async function loadInitial() {
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          fetch(`${API_URL}/products?page=1&limit=10`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/categories/options?isActive=true`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const productData = await productResponse.json();
        const categoryData = await categoryResponse.json();
        if (!productResponse.ok)
          throw new Error(productData.message || "Unable to load products");
        if (!categoryResponse.ok)
          throw new Error(categoryData.message || "Unable to load categories");
        setData({
          items: productData.data || [],
          page: productData.pagination?.page || 1,
          pages: productData.pagination?.pages || 0,
        });
        setCategories(categoryData.items || categoryData.data || []);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadInitial();
  }, [token]);

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(
        `${API_URL}/products${editing ? `/${editing}` : ""}`,
        {
          method: editing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to save product");
      setForm(blank);
      setEditing(null);
      await load(data.page);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function deactivate() {
    try {
      const response = await fetch(`${API_URL}/products/${confirmId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to deactivate product");
      setConfirmId(null);
      await load(data.page);
    } catch (requestError) {
      setError(requestError.message);
      setConfirmId(null);
    }
  }

  function edit(product) {
    setEditing(product._id);
    setForm({
      sku: product.sku,
      name: product.name,
      category: product.category?._id || "",
      sellingPrice: product.sellingPrice,
      reorderLevel: product.reorderLevel,
      isActive: product.isActive,
    });
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Products</h1>
          <p>Search, filter and maintain your product catalogue.</p>
        </div>
        {user.role === "admin" && !editing && (
          <Button onClick={() => setEditing("new")}>Add product</Button>
        )}
      </div>
      <ErrorMessage message={error} />
      <ProductFilters
        filters={filters}
        categories={categories}
        onChange={setFilters}
        onApply={() => load(1, filters)}
      />
      {user.role === "admin" && editing && (
        <ProductForm
          form={editing === "new" ? blank : form}
          categories={categories}
          editing={editing !== "new"}
          onChange={setForm}
          onSubmit={submit}
          onCancel={() => {
            setEditing(null);
            setForm(blank);
          }}
          submitting={submitting}
        />
      )}
      <section className="card" style={{ padding: 0 }}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <ProductTable
            products={data.items}
            admin={user.role === "admin"}
            onEdit={edit}
            onDeactivate={setConfirmId}
          />
        )}
      </section>
      <Pagination
        page={data.page}
        pages={data.pages}
        onChange={(page) => load(page)}
      />
      <ConfirmDialog
        open={Boolean(confirmId)}
        title="Deactivate product?"
        message="The product will remain in history but will no longer be available for new orders."
        onConfirm={deactivate}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
}
