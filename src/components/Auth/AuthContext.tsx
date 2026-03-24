import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro";
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "craftcv_user";

// Simulated user store (in a real app this would be a backend call)
const getUserStore = (): Record<string, { password: string; user: User }> => {
  try {
    return JSON.parse(localStorage.getItem("craftcv_user_store") || "{}");
  } catch {
    return {};
  }
};

const saveUserStore = (store: Record<string, { password: string; user: User }>) => {
  localStorage.setItem("craftcv_user_store", JSON.stringify(store));
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    const store = getUserStore();
    const entry = store[email.toLowerCase()];
    if (!entry) return { error: "No account found with that email." };
    if (entry.password !== password) return { error: "Incorrect password." };
    setUser(entry.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry.user));
    return {};
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<{ error?: string }> => {
    await new Promise((r) => setTimeout(r, 600));
    const store = getUserStore();
    if (store[email.toLowerCase()]) return { error: "An account with that email already exists." };
    const newUser: User = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      name,
      plan: "free",
    };
    store[email.toLowerCase()] = { password, user: newUser };
    saveUserStore(store);
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return {};
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
