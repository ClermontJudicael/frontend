"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ajoutez cette fonction
  const decodeToken = (token) => {
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = decodeToken(token);

        if (decodedUser?.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setUser(null);
        } else {
          // Stockez à la fois les données décodées ET le token brut
          setUser({
            ...decodedUser,
            token // Conservez le token JWT original
          });
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decodedUser = decodeToken(token);
    setUser({
      ...decodedUser,
      token // Stockez le token complet
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Ajoutez reloadAuth cohérent
  const reloadAuth = () => {
    const token = localStorage.getItem("token"); // Utilisez "token" partout
    if (token) {
      const decodedUser = decodeToken(token);
      setUser({
        ...decodedUser,
        token
      });
    } else {
      setUser(null);
    }
  };

  return (
      <AuthContext.Provider value={{
        user,
        login,
        logout,
        reloadAuth // Exposez la fonction
      }}>
        {!loading && children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}