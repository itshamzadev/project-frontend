import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import FormField from "../../components/common/FormField.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import OrderItemRow from "../../components/orders/OrderItemRow.jsx";
import OrderSummary from "../../components/orders/OrderSummary.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_URL } from "../../config/env.js";

export default function CreateOrderPage({ editing = false }) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState("");
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState([{ product: "", quantity: 1 }]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const requests = [
          fetch(`${API_URL}/products?page=1&limit=100&isActive=true`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/customers?page=1&limit=100`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ];
        if (editing) {
          requests.push(
            fetch(`${API_URL}/orders/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          );
        }

        const responses = await Promise.all(requests);
        const productData = await responses[0].json();
        const customerData = await responses[1].json();
        if (!responses[0].ok)
          throw new Error(productData.message || "Unable to load products");
        if (!responses[1].ok)
          throw new Error(customerData.message || "Unable to load customers");
        setProducts(productData.data || []);
        setCustomers(customerData.data || []);

        if (editing) {
          const orderData = await responses[2].json();
          if (!responses[2].ok)
            throw new Error(orderData.message || "Unable to load order");
          if (orderData.status !== "Draft")
            throw new Error("Only Draft orders can be edited");
          setCustomer(orderData.customer?._id || "");
          setDiscount(orderData.discount);
          setItems(
            orderData.items.map((item) => ({
              product: item.product?._id,
              quantity: item.quantity,
            })),
          );
        }
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token, editing, id]);
  const selectedIds = useMemo(
    () => items.map((item) => item.product).filter(Boolean),
    [items],
  );
  function changeItem(index, value) {
    if (
      value.product &&
      selectedIds.includes(value.product) &&
      value.product !== items[index].product
    ) {
      setError("Each product can only appear once in an order.");
      return;
    }
    setError("");
    setItems(
      items.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  }

  function removeItem(index) {
    if (items.length > 1)
      setItems(items.filter((_, itemIndex) => itemIndex !== index));
  }

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(
        `${API_URL}/orders${editing ? `/${id}` : ""}`,
        {
          method: editing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ customer, discount, items }),
        },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to save order");
      navigate(`/orders/${result._id}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }
  if (loading) return <LoadingSpinner />;
  if (!products.length || !customers.length)
    return (
      <>
        <div className="page-heading">
          <div>
            <h1>{editing ? "Edit draft order" : "Create sales order"}</h1>
            <p>
              Order setup requires active products and at least one customer.
            </p>
          </div>
        </div>
        <ErrorMessage message={error} />
        <section className="card">
          <EmptyState
            title="Order setup is incomplete"
            message={
              !products.length && !customers.length
                ? "Add an active product and a customer before creating an order."
                : !products.length
                  ? "Add an active product before creating an order."
                  : "Add a customer before creating an order."
            }
          />
        </section>
      </>
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>{editing ? "Edit draft order" : "Create sales order"}</h1>
          <p>
            {editing
              ? "Update the existing Draft record before confirmation."
              : "Create a Draft; the server calculates final prices and totals."}
          </p>
        </div>
      </div>
      <ErrorMessage message={error} />
      <form className="form-stack" onSubmit={submit}>
        <section className="card form-grid">
          <FormField label="Customer" required>
            <select
              required
              value={customer}
              onChange={(event) => setCustomer(event.target.value)}
            >
              <option value="">Choose customer</option>
              {customers.map((entry) => (
                <option key={entry._id} value={entry._id}>
                  {entry.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Discount">
            <input
              min="0"
              step="0.01"
              type="number"
              value={discount}
              onChange={(event) => setDiscount(event.target.value)}
            />
          </FormField>
        </section>
        <section className="card">
          <div className="split">
            <h2>Order items</h2>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setItems([...items, { product: "", quantity: 1 }])}
            >
              Add item
            </Button>
          </div>
          <div className="order-lines" style={{ marginTop: 16 }}>
            {items.map((item, index) => (
              <OrderItemRow
                key={index}
                item={item}
                products={products}
                index={index}
                onChange={changeItem}
                onRemove={removeItem}
                canRemove={items.length > 1}
              />
            ))}
          </div>
        </section>
        <OrderSummary items={items} products={products} discount={discount} />
        <div className="form-actions">
          <Button disabled={submitting}>
            {submitting
              ? "Saving…"
              : editing
                ? "Save draft changes"
                : "Save as draft"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/orders")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
}
