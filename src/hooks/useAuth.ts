import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const signUp = async (credentials) => {
        // Logic for sign up (e.g., API call)
        // On success, update user state
        setUser(credentials);
    };

    const login = async (credentials) => {
        // Logic for login (e.g., API call)
        // On success, update user state
        setUser(credentials);
    };

    const logout = () => {
        // Logic for logout
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, signUp, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};