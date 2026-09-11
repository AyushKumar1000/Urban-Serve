import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUser, UserRole } from "../types";
import { loginApi, signupApi } from "../api/auth";

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
    const storedUser = localStorage.getItem("current_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // ignore
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    const loggedInUser = await loginApi(email, password, role);
    setUser(loggedInUser);
    localStorage.setItem("current_user", JSON.stringify(loggedInUser));
  };

  const signup = async (data: Partial<AuthUser> & { password: string }, role: UserRole) => {
    const newUser = await signupApi(data, role);
    setUser(newUser);
    localStorage.setItem("current_user", JSON.stringify(newUser));
  };

  const updateUserLocation = (address: string, coords?: { lat: number; lng: number }) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, address, coordinates: coords || prev.coordinates };
      localStorage.setItem("current_user", JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("current_user");
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
