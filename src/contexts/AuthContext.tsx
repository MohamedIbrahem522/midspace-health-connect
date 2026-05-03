import React, { createContext, useContext, useState, useCallback } from "react";

export type UserRole = "doctor" | "hospital" | "patient" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  register: (name: string, email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("midspace_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((email: string, _password: string, role: UserRole) => {
    const u: User = { id: crypto.randomUUID(), name: email.split("@")[0], email, role };
    setUser(u);
    localStorage.setItem("midspace_user", JSON.stringify(u));
  }, []);

  const register = useCallback((name: string, email: string, _password: string, role: UserRole) => {
    const u: User = { id: crypto.randomUUID(), name, email, role };
    setUser(u);
    localStorage.setItem("midspace_user", JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("midspace_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
