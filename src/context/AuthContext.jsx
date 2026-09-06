import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { API_URL } from "../config/env.js";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function restore() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Your session has expired");
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (requestError) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }
    restore();
  }, [token]);

  async function login(credentials) {
    setError("");
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || "Unable to sign in");
      throw new Error(data.message || "Unable to sign in");
    }
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, token, loading, error, login, logout }),
    [user, token, loading, error],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
