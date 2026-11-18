
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      setLoading(false);
      return;
    }

    api.get("/auth/me/")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Erreur profil :", error.response?.data || error.message);

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Connexion
  const login = async (email, password) => {
    const response = await api.post("/auth/login/", {
      email,
      password,
    });

    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);

    setUser(response.data.user);

    return response.data.user;
  };

  // Inscription
  const register = async (data) => {
    const response = await api.post("/auth/register/", data);

    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);

    setUser(response.data.user);

    return response.data.user;
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
