import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
  user: Record<string, unknown> | null;
  signUp: (credentials: Record<string, unknown>) => Promise<void>;
  login: (credentials: Record<string, unknown>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Record<string, unknown> | null>(null);

  const signUp = async (credentials: Record<string, unknown>) => {
    setUser(credentials);
  };

  const login = async (credentials: Record<string, unknown>) => {
    setUser(credentials);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signUp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
