import { useEffect, useState } from "react";
import CustomerForm from "../../components/customers/CustomerForm.jsx";
import CustomerTable from "../../components/customers/CustomerTable.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import SearchInput from "../../components/common/SearchInput.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_URL } from "../../config/env.js";
const blank = { name: "", email: "", phone: "", address: "" };

export default function CustomersPage() {
  const { token } = useAuth();
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function load(page = 1) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.set("search", search);
      const response = await fetch(`${API_URL}/customers?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to load customers");
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

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(
        `${API_URL}/customers${editing ? `/${editing}` : ""}`,
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
        throw new Error(result.message || "Unable to save customer");
      setForm(blank);
      setEditing(null);
      await load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function remove() {
    try {
      const response = await fetch(`${API_URL}/customers/${confirmId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to delete customer");
      setConfirmId(null);
      await load(data.page);
    } catch (requestError) {
      setError(requestError.message);
      setConfirmId(null);
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Customers</h1>
          <p>Manage contacts and inspect their actual order history.</p>
        </div>
      </div>
      <ErrorMessage message={error} />
      <SearchInput
        value={search}
        onChange={setSearch}
        onSubmit={() => load(1)}
        placeholder="Search name, email or phone"
      />
      <CustomerForm
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
      <section className="card" style={{ padding: 0 }}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <CustomerTable
            customers={data.items}
            onEdit={(customer) => {
              setEditing(customer._id);
              setForm({
                name: customer.name,
                email: customer.email || "",
                phone: customer.phone || "",
                address: customer.address || "",
              });
            }}
            onDelete={setConfirmId}
          />
        )}
      </section>
      <Pagination page={data.page} pages={data.pages} onChange={load} />
      <ConfirmDialog
        open={Boolean(confirmId)}
        title="Delete customer?"
        message="Customers with order history cannot be deleted."
        onConfirm={remove}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
}
