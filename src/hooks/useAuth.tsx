import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthResult {
  error?: string;
}

interface AuthContextType {
  user: Record<string, unknown> | null;
  signUp: (credentials: Record<string, unknown>) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<AuthResult>;
  login: (email: string, password?: string) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Record<string, unknown> | null>(null);

  const signUp = async (credentials: Record<string, unknown>) => {
    setUser(credentials);
  };

  const signup = async (name: string, email: string, password: string): Promise<AuthResult> => {
    setUser({ name, email });
    return {};
  };

  const login = async (email: string, password?: string): Promise<AuthResult> => {
    setUser({ email });
    return {};
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
