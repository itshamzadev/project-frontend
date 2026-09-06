import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Page not found</h1>
        <p>The requested page does not exist.</p>
        <Link className="button full" to="/dashboard">
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
