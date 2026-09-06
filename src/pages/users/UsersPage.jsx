import { useEffect, useState } from "react";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import UserForm from "../../components/users/UserForm.jsx";
import UserTable from "../../components/users/UserTable.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_URL } from "../../config/env.js";
const blank = { name: "", email: "", password: "", role: "sales" };

export default function UsersPage() {
  const { token, user: currentUser } = useAuth();
  const [data, setData] = useState({ items: [], page: 1, pages: 0 });
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    isActive: "",
  });
  const [form, setForm] = useState(blank);
  const [pendingDeactivation, setPendingDeactivation] = useState(null);
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
      const response = await fetch(`${API_URL}/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to load users");
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

  async function create(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to create user");
      setForm(blank);
      await load(1);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function update(id, changes) {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(changes),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to update user");
      await load(data.page);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function requestUpdate(id, changes) {
    if (changes.isActive === false) return setPendingDeactivation(id);
    update(id, changes);
  }

  async function confirmDeactivation() {
    const id = pendingDeactivation;
    setPendingDeactivation(null);
    if (id) await update(id, { isActive: false });
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>User management</h1>
          <p>
            Admin-only access, with password hashes never returned to the
            client.
          </p>
        </div>
      </div>
      <ErrorMessage message={error} />
      <UserForm
        form={form}
        onChange={setForm}
        onSubmit={create}
        submitting={submitting}
      />
      <div className="toolbar">
        <input
          placeholder="Search name or email"
          value={filters.search}
          onChange={(event) =>
            setFilters({ ...filters, search: event.target.value })
          }
        />
        <select
          value={filters.role}
          onChange={(event) =>
            setFilters({ ...filters, role: event.target.value })
          }
        >
          <option value="">All roles</option>
          <option value="sales">Sales</option>
          <option value="warehouse">Warehouse</option>
          <option value="admin">Admin</option>
        </select>
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
      <section className="card" style={{ marginTop: 16, padding: 0 }}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <UserTable
            users={data.items}
            currentUserId={currentUser.id || currentUser._id}
            onUpdate={requestUpdate}
          />
        )}
      </section>
      <Pagination
        page={data.page}
        pages={data.pages}
        onChange={(page) => load(page)}
      />
      <ConfirmDialog
        open={Boolean(pendingDeactivation)}
        title="Deactivate user?"
        message="This user will immediately lose access to protected APIs and pages."
        onConfirm={confirmDeactivation}
        onCancel={() => setPendingDeactivation(null)}
      />
    </>
  );
}
