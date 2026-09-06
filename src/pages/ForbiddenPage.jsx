import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Access denied</h1>
        <p>Your role does not have permission to view this page.</p>
        <Link className="button full" to="/dashboard">
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
