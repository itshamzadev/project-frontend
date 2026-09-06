const configuredApiUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");

export const API_URL = configuredApiUrl
  ? configuredApiUrl.endsWith("/api")
    ? configuredApiUrl
    : `${configuredApiUrl}/api`
  : "";

if (!API_URL) {
  throw new Error("VITE_API_BASE_URL is missing. Check the frontend .env configuration.");
}
