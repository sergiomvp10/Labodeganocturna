"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { api } from "@/lib/api";

export interface AdminUser {
  id: string;
  username: string;
  role: "admin" | "editor";
  createdAt: string;
}

interface AuthContextType {
  currentUser: AdminUser | null;
  /** false hasta leer la sesion de localStorage, para no mostrar el login a quien ya entro. */
  ready: boolean;
  users: AdminUser[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (username: string, password: string, role: "admin" | "editor") => Promise<boolean>;
  updateUser: (id: string, data: Partial<AdminUser> & { password?: string }) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedSession = localStorage.getItem("lbn_admin_session");
    if (storedSession) {
      setCurrentUser(JSON.parse(storedSession));
    }
    setReady(true);
  }, []);

  const refreshUsers = useCallback(async () => {
    try {
      const data = await api.getUsers();
      setUsers(data.map((u) => ({ id: String(u.id), username: u.username, role: u.role as "admin" | "editor", createdAt: u.createdAt })));
    } catch {}
  }, []);

  useEffect(() => {
    if (currentUser) refreshUsers();
  }, [currentUser, refreshUsers]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const data = await api.login(username, password);
      const user: AdminUser = {
        id: String(data.user.id),
        username: data.user.username,
        role: data.user.role as "admin" | "editor",
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(user);
      localStorage.setItem("lbn_admin_session", JSON.stringify(user));
      localStorage.setItem("lbn_token", data.token);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("lbn_admin_session");
    localStorage.removeItem("lbn_token");
  };

  const addUser = async (username: string, password: string, role: "admin" | "editor"): Promise<boolean> => {
    try {
      await api.createUser(username, password, role);
      await refreshUsers();
      return true;
    } catch {
      return false;
    }
  };

  const updateUser = async (id: string, data: Partial<AdminUser> & { password?: string }) => {
    try {
      const payload: { username?: string; password?: string; role?: string } = {};
      if (data.username) payload.username = data.username;
      if (data.password) payload.password = data.password;
      if (data.role) payload.role = data.role;
      await api.updateUser(Number(id), payload);
      await refreshUsers();
    } catch {}
  };

  const deleteUser = async (id: string) => {
    try {
      await api.deleteUser(Number(id));
      await refreshUsers();
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, ready, users, login, logout, addUser, updateUser, deleteUser, refreshUsers }}
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
