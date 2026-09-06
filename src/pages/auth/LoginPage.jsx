import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import FormField from "../../components/common/FormField.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  if (user) return <Navigate to="/dashboard" replace />;

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <section className="auth-hero">
          <div className="auth-brand">
            <span>Inventory Suite</span>
          </div>
          <div className="auth-hero-copy">
            <p className="auth-eyebrow">Inventory & sales control</p>
            <h2>Stock in. Orders out. Stay in control.</h2>
            <p>
              Manage products, incoming stock, sales orders and movement history
              from one place.
            </p>
          </div>
          <div className="auth-hero-list">
            <span>Product catalogue</span>
            <span>Sales orders</span>
            <span>Stock movements</span>
          </div>
        </section>

        <form className="auth-card form-stack" onSubmit={submit}>
          <div>
            <p className="eyebrow">Secure sign-in</p>
            <h1>Welcome back</h1>
            <p>Sign in to manage your inventory and orders.</p>
          </div>
          <ErrorMessage message={error} />
          <FormField label="Email" required>
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
            />
          </FormField>
          <FormField label="Password" required>
            <input
              type="password"
              required
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
            />
          </FormField>
          <Button className="full" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
          <p className="auth-foot">User accounts are created by an Admin.</p>
        </form>
      </div>
    </div>
  );
}
