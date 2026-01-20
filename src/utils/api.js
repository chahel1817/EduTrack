import axios from "axios";

/* --------------------------------------------------
   AXIOS INSTANCE
-------------------------------------------------- */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
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
    if (!error.response) {
      console.error("❌ Network error or server down");
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
      console.error("🔥 Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);
