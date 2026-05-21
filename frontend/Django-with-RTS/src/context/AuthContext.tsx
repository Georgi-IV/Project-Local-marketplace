import { createContext, useEffect, useMemo, useState, useContext } from "react";
import type { ReactNode } from "react";

export type UserProfile = {
  name: string;
  email: string;
  dateOfBirth?: string;
  phone?: string;
};

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (user: UserProfile) => void;
  logout: () => void;
  updateProfile: (values: Partial<UserProfile>) => void;
}

const LOCAL_STORAGE_USER = "lomarketplace_user";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = window.localStorage.getItem(LOCAL_STORAGE_USER);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          window.localStorage.removeItem(LOCAL_STORAGE_USER);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        window.localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(LOCAL_STORAGE_USER);
      }
    }
  }, [user]);

  const login = (newUser: UserProfile) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (values: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ...values,
      };
    });
  };

  const value = useMemo(
    () => ({
      isLoggedIn: Boolean(user),
      user,
      login,
      logout,
      updateProfile,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
