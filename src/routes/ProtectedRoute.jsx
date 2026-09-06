import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return user ? children : <Navigate to="/login" replace />;
}
