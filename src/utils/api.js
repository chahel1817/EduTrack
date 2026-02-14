import axios from "axios";

/* --------------------------------------------------
   AXIOS INSTANCE
-------------------------------------------------- */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api",
  timeout: 120000,
});

/* --------------------------------------------------
   REQUEST INTERCEPTOR
   → Attach JWT token automatically
-------------------------------------------------- */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* --------------------------------------------------
   RESPONSE INTERCEPTOR
   → Global error handling
-------------------------------------------------- */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ignore aborted requests (by AbortController)
    if (axios.isCancel(error) || error.code === "ERR_CANCELED" || error.message === "canceled") {
      return Promise.reject(error);
    }

    if (!error.response) {
      if (import.meta.env.MODE !== 'production') {
        console.error("Network error:", error.message);
      }
      return Promise.reject(error);
    }

    const { status } = error.response;

    // Unauthorized → logout
    if (status === 401) {
      console.warn("🔐 Session expired. Logging out...");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // Forbidden
    if (status === 403) {
      console.warn("🚫 Access denied");
    }

    // Server error
    if (status >= 500) {
      // Log server errors minimally if not in production
      if (import.meta.env.MODE !== 'production') {
        console.error("API Server Error:", error.response.data);
      }
    }

    return Promise.reject(error);
  }
);
