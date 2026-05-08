import React, { createContext, useContext, useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

type AuthContextType = {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const utils = trpc.useUtils();
  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loginMutation = trpc.auth.loginEmail.useMutation();
  const signupMutation = trpc.auth.signup.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  // Initialize auth state from server and localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First, try to get auth state from server
        if (meQuery.data) {
          setUser(meQuery.data);
          setIsAuthenticated(true);
          localStorage.setItem("auth_user", JSON.stringify(meQuery.data));
        } else if (meQuery.isError) {
          // Server says user is not authenticated
          // Check localStorage as fallback
          const savedUser = localStorage.getItem("auth_user");
          if (savedUser) {
            try {
              const userData = JSON.parse(savedUser);
              setUser(userData);
              setIsAuthenticated(true);
            } catch (e) {
              localStorage.removeItem("auth_user");
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("[Auth] Failed to initialize:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (!meQuery.isLoading) {
      initializeAuth();
    }
  }, [meQuery.data, meQuery.isError, meQuery.isLoading]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await loginMutation.mutateAsync({ email, password });
      
      // Refresh auth state after login
      await utils.auth.me.refetch();
      
      // Update local state
      const userData = await meQuery.refetch();
      if (userData.data) {
        setUser(userData.data);
        setIsAuthenticated(true);
        localStorage.setItem("auth_user", JSON.stringify(userData.data));
      }
    } catch (error) {
      console.error("[Auth] Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      setIsLoading(true);
      const result = await signupMutation.mutateAsync({
        name,
        email,
        password,
        confirmPassword,
      });

      // Refresh auth state after signup
      await utils.auth.me.refetch();
      
      // Update local state
      const userData = await meQuery.refetch();
      if (userData.data) {
        setUser(userData.data);
        setIsAuthenticated(true);
        localStorage.setItem("auth_user", JSON.stringify(userData.data));
      }
    } catch (error) {
      console.error("[Auth] Signup failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await logoutMutation.mutateAsync();
      
      // Clear local state
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("auth_user");
      
      // Invalidate auth cache
      await utils.auth.me.invalidate();
    } catch (error) {
      console.error("[Auth] Logout failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    try {
      setIsLoading(true);
      await utils.auth.me.refetch();
      if (meQuery.data) {
        setUser(meQuery.data);
        setIsAuthenticated(true);
        localStorage.setItem("auth_user", JSON.stringify(meQuery.data));
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("auth_user");
      }
    } catch (error) {
      console.error("[Auth] Refresh failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
