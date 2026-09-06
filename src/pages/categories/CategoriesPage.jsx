import { useEffect, useState } from "react";
import CategoryForm from "../../components/categories/CategoryForm.jsx";
import CategoryTable from "../../components/categories/CategoryTable.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_URL } from "../../config/env.js";
const blank = { name: "", description: "", isActive: true };

export default function CategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 0 });
  const [filters, setFilters] = useState({ search: "", isActive: "" });
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
      const response = await fetch(`${API_URL}/categories?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to load categories");
      setCategories(result.data || []);
      setPagination({
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

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(
        `${API_URL}/categories${editing ? `/${editing}` : ""}`,
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
        throw new Error(result.message || "Unable to save category");
      setForm(blank);
      setEditing(null);
      await load(pagination.page);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function remove() {
    try {
      const response = await fetch(`${API_URL}/categories/${confirmId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to delete category");
      setConfirmId(null);
      await load(pagination.page);
    } catch (requestError) {
      setError(requestError.message);
      setConfirmId(null);
    }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Categories</h1>
          <p>Keep product classification clear and manageable.</p>
        </div>
      </div>
      <ErrorMessage message={error} />
      <CategoryForm
        form={form}
        editing={Boolean(editing)}
        onChange={setForm}
        onSubmit={submit}
        onCancel={() => {
          setEditing(null);
          setForm(blank);
        }}
        submitting={submitting}
      />
      <div className="toolbar">
        <input
          placeholder="Search category name"
          value={filters.search}
          onChange={(event) =>
            setFilters({ ...filters, search: event.target.value })
          }
        />
        <select
          value={filters.isActive}
          onChange={(event) =>
            setFilters({ ...filters, isActive: event.target.value })
          }
        >
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button className="button" onClick={() => load(1, filters)}>
          Apply filters
        </button>
      </div>
      <section className="card" style={{ padding: 0 }}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <CategoryTable
            categories={categories}
            onEdit={(category) => {
              setEditing(category._id);
              setForm({
                name: category.name,
                description: category.description || "",
                isActive: category.isActive,
              });
            }}
            onDelete={setConfirmId}
          />
        )}
      </section>
      <Pagination
        page={pagination.page}
        pages={pagination.pages}
        onChange={(page) => load(page)}
      />
      <ConfirmDialog
        open={Boolean(confirmId)}
        title="Delete category?"
        message="Products using this category may prevent deletion. Continue?"
        onConfirm={remove}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
}
