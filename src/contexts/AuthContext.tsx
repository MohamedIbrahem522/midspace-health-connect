import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

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
    const stored = localStorage.getItem("midspace_user");

    if (stored) {
      setUser(JSON.parse(stored));
    }

    setLoading(false);
  }, []);

  const login = useCallback((email: string, password: string, role: UserRole) => {
    const u: User = {
      id: crypto.randomUUID(),
      name: email.split("@")[0],
      email,
      role,
    };

    setUser(u);
    localStorage.setItem("midspace_user", JSON.stringify(u));
    localStorage.setItem("midspace_token", `mock_token_${email}`);
  }, []);

  const register = useCallback((name: string, email: string, password: string, role: UserRole) => {
    const u: User = {
      id: crypto.randomUUID(),
      name,
      email,
      role,
    };

    setUser(u);
    localStorage.setItem("midspace_user", JSON.stringify(u));
    localStorage.setItem("midspace_token", `mock_token_${email}`);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("midspace_user");
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