import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "@/services/api";

export type UserRole = "doctor" | "hospital" | "patient" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  specialty?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, id, name, role, specialty, profileImage } = response.data;

      localStorage.setItem("token", token);
      
      const newUser: User = {
        id,
        name,
        email,
        role: role.toLowerCase() as UserRole,
        specialty,
        profileImage
      };

      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    } catch (error) {
      throw new Error("Invalid email or password");
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: string) => {
    try {
      const response = await api.post("/auth/register", { name, email, password, role });
      const { token, id, specialty, profileImage } = response.data;

      localStorage.setItem("token", token);
      
      const newUser: User = {
        id,
        name,
        email,
        role: role.toLowerCase() as UserRole,
        specialty,
        profileImage
      };

      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      throw new Error("Registration failed");
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
