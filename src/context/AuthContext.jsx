import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";

const AuthContext = createContext();

/* --------------------------------------------------
   AUTH PROVIDER
-------------------------------------------------- */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD USER ON APP START ---------------- */
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    setLoading(false);
    return;
  }

  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  api
    .get("/auth/me")
    .then((res) => setUser(res.data))
    .catch(logout)
    .finally(() => setLoading(false));
}, []);



  /* ---------------- LOGIN ---------------- */
  const login = async (credentials) => {
    const res = await api.post("/auth/login", credentials);

    const { token, user } = res.data;

    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setUser(user);
  };

  /* ---------------- SIGNUP ---------------- */
  const signup = async (data) => {
    await api.post("/auth/signup", data);
  };

  /* ---------------- SET AUTH (for OTP login) ---------------- */
  const setAuth = (token, userData) => {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        setAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* --------------------------------------------------
   CUSTOM HOOK
-------------------------------------------------- */
export const useAuth = () => {
  return useContext(AuthContext);
};
