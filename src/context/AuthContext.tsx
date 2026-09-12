import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUser, UserRole } from "../types";
import { loginApi, signupApi, updateLocationApi } from "../api/auth";
import { clearToken } from "../lib/api";

type AuthContextState = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (data: Partial<AuthUser> & { password: string }, role: UserRole) => Promise<void>;
  updateUserLocation: (address: string, coords?: { lat: number; lng: number }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore user from localStorage on mount
    const storedUser = localStorage.getItem("current_user");
    const storedToken = localStorage.getItem("auth_token");
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // ignore corrupt data
        localStorage.removeItem("current_user");
        localStorage.removeItem("auth_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    const response = await loginApi(email, password, role);
    setUser(response.user);
    localStorage.setItem("current_user", JSON.stringify(response.user));
    // Token is already stored by loginApi via setToken()
  };

  const signup = async (data: Partial<AuthUser> & { password: string }, role: UserRole) => {
    const response = await signupApi(data, role);
    setUser(response.user);
    localStorage.setItem("current_user", JSON.stringify(response.user));
    // Token is already stored by signupApi via setToken()
  };

  const updateUserLocation = async (address: string, coords?: { lat: number; lng: number }) => {
    if (!user) return;

    try {
      const updatedUser = await updateLocationApi(user.id, address, coords?.lat, coords?.lng);
      setUser(updatedUser);
      localStorage.setItem("current_user", JSON.stringify(updatedUser));
    } catch (e) {
      // Fallback: update locally if server fails
      const updated = { ...user, address, coordinates: coords || user.coordinates };
      setUser(updated);
      localStorage.setItem("current_user", JSON.stringify(updated));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("current_user");
    clearToken();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, updateUserLocation, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
