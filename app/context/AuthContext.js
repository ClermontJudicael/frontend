"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        
        // Check if the token is expired
        if (decodedUser.exp * 1000 < Date.now()) {
          // Remove expired token
          localStorage.removeItem("token");
          setUser(null); // Clear user state
        } else {
          // Set user if the token is valid
          setUser(decodedUser); 
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token"); // Clear invalid token
        setUser(null); // Clear user state
      }
    } else {
      setUser(null); // No token, so clear user state
    }
    setLoading(false); // Done checking the token
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return null; // Or a loading spinner can be returned until the token is checked
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
