import { createContext, useContext, useState, useEffect, useRef } from "react";
import { api } from "../utils/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Prevent duplicate profile requests on strict mode
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const res = await api.get("/auth/profile");
        setUser(res.data);
      } catch (error) {
        console.warn("Auto login failed:", error.response?.data || error.message);
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  /* ------------------------------ LOGIN ------------------------------ */
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      if (!res.data || !res.data.token) {
        throw new Error("Invalid response from server");
      }

      const { token, user: userData } = res.data;

      if (!token || !userData) {
        throw new Error("Missing token or user data");
      }

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(userData);
      return userData;
    } catch (err) {
      console.error("Login error in AuthContext:", err);
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        throw { message: "Cannot connect to server. Please ensure the backend server is running on http://localhost:5000" };
      }
      throw err.response?.data || err || { message: "Login failed" };
    }
  };

  /* ------------------------------ SIGNUP ------------------------------ */
  const signup = async (userInfo) => {
    try {
      const res = await api.post("/auth/signup", userInfo);
      return res.data;
    } catch (err) {
      console.error("Signup error in AuthContext:", err);
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        throw { message: "Cannot connect to server. Please ensure the backend server is running on http://localhost:5000" };
      }
      throw err.response?.data || err || { message: "Signup failed" };
    }
  };

  /* ------------------------------ LOGOUT ------------------------------ */
  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
