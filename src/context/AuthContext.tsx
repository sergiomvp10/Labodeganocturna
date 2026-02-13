"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  role: "admin" | "editor";
  createdAt: string;
}

interface AuthContextType {
  currentUser: AdminUser | null;
  users: AdminUser[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (username: string, password: string, role: "admin" | "editor") => boolean;
  updateUser: (id: string, data: Partial<AdminUser>) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADMIN: AdminUser = {
  id: "1",
  username: "admin",
  password: "admin123",
  role: "admin",
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storedUsers = localStorage.getItem("lbn_admin_users");
    const storedSession = localStorage.getItem("lbn_admin_session");

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers([DEFAULT_ADMIN]);
      localStorage.setItem("lbn_admin_users", JSON.stringify([DEFAULT_ADMIN]));
    }

    if (storedSession) {
      setCurrentUser(JSON.parse(storedSession));
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded && users.length > 0) {
      localStorage.setItem("lbn_admin_users", JSON.stringify(users));
    }
  }, [users, loaded]);

  const login = (username: string, password: string): boolean => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      localStorage.setItem("lbn_admin_session", JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("lbn_admin_session");
  };

  const addUser = (username: string, password: string, role: "admin" | "editor"): boolean => {
    if (users.some((u) => u.username === username)) return false;
    const newUser: AdminUser = {
      id: Date.now().toString(),
      username,
      password,
      role,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    return true;
  };

  const updateUser = (id: string, data: Partial<AdminUser>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...data } : u))
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, users, login, logout, addUser, updateUser, deleteUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
