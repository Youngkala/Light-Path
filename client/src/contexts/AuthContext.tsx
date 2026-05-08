import React, { createContext, useContext, useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

type AuthContextType = {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
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

  // Initialize auth state on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("[Auth] Initializing auth state...");
        
        // Check if user is authenticated on the server
        if (meQuery.data) {
          console.log("[Auth] User authenticated:", meQuery.data.email);
          setUser(meQuery.data);
          setIsAuthenticated(true);
          localStorage.setItem("auth_user", JSON.stringify(meQuery.data));
          localStorage.setItem("isLoggedIn", "true");
        } else if (meQuery.isError) {
          console.log("[Auth] User not authenticated");
          // Check localStorage as fallback
          const savedUser = localStorage.getItem("auth_user");
          if (savedUser) {
            try {
              const userData = JSON.parse(savedUser);
              console.log("[Auth] Restoring user from localStorage:", userData.email);
              setUser(userData);
              setIsAuthenticated(true);
            } catch (e) {
              console.log("[Auth] Failed to parse saved user, clearing storage");
              localStorage.removeItem("auth_user");
              localStorage.removeItem("isLoggedIn");
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            console.log("[Auth] No saved user in localStorage");
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
      console.log("[Auth] Attempting login for:", email);
      setIsLoading(true);
      
      // Call login endpoint
      const result = await loginMutation.mutateAsync({ email, password });
      console.log("[Auth] Login successful");
      
      // Refresh auth state from server
      await utils.auth.me.refetch();
      if (meQuery.data) {
        console.log("[Auth] Setting authenticated state for:", meQuery.data.email);
        setUser(meQuery.data);
        setIsAuthenticated(true);
        localStorage.setItem("auth_user", JSON.stringify(meQuery.data));
        localStorage.setItem("isLoggedIn", "true");
      }
    } catch (error) {
      console.error("[Auth] Login failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("auth_user");
      localStorage.removeItem("isLoggedIn");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      console.log("[Auth] Attempting signup for:", email);
      setIsLoading(true);
      
      // Call signup endpoint
      const result = await signupMutation.mutateAsync({
        name,
        email,
        password,
        confirmPassword,
      });
      console.log("[Auth] Signup successful");

      // Refresh auth state from server
      await utils.auth.me.refetch();
      if (meQuery.data) {
        console.log("[Auth] Setting authenticated state for:", meQuery.data.email);
        setUser(meQuery.data);
        setIsAuthenticated(true);
        localStorage.setItem("auth_user", JSON.stringify(meQuery.data));
        localStorage.setItem("isLoggedIn", "true");
      }
    } catch (error) {
      console.error("[Auth] Signup failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("auth_user");
      localStorage.removeItem("isLoggedIn");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("[Auth] Logging out user");
      setIsLoading(true);
      
      // Call logout endpoint
      await logoutMutation.mutateAsync();
      console.log("[Auth] Logout successful");
      
      // Clear all auth state
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("auth_user");
      localStorage.removeItem("isLoggedIn");
      
      // Invalidate auth cache
      await utils.auth.me.invalidate();
    } catch (error) {
      console.error("[Auth] Logout failed:", error);
      // Still clear local state even if logout fails
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("auth_user");
      localStorage.removeItem("isLoggedIn");
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
