// src/context/AuthProvider.jsx
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import API from "../utils/axios";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const res = await API.get("/auth/me");

          console.log("Auth Check Success:", res.data.user);
          setUser(res.data);
        } catch (err) {
          console.error("Auth Check Failed:", err);
          setUser(null);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // LOGIN
  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });

    if (res.data.token) {
      console.log("AuthProvider Login:", res.data);
      localStorage.setItem("token", res.data.token);

      setUser(res.data.user);
    }

    return res.data;
  };

  // SIGNUP
  const signup = async (name, email, password) => {
    const res = await API.post("/auth/signup", { name, email, password });
    return res.data;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  console.log("User", user);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
