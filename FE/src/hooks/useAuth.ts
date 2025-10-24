"use client";

import { useAuthStore } from "@/store/auth-store";
import { useEffect, useState } from "react";

/**
 * Custom hook để xử lý authentication với hydration safety
 * Tránh hydration mismatch bằng cách đợi client-side hydration
 */
export function useAuth() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { user, isAuthenticated, isLoading, error, initializeAuth } =
    useAuthStore();

  useEffect(() => {
    setIsHydrated(true);
    // Initialize authentication state sau khi hydrate
    initializeAuth();
  }, [initializeAuth]);

  return {
    user,
    isAuthenticated: isHydrated ? isAuthenticated : false,
    isLoading: !isHydrated || isLoading,
    error,
  };
}
