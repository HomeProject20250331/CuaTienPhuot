"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Custom hook để xử lý authentication guard
 * Tự động redirect về login nếu user chưa đăng nhập
 * Sử dụng hydration-safe useAuth hook
 */
export function useAuthGuard() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  return {
    isAuthenticated,
    authLoading,
    shouldRender: authLoading || isAuthenticated,
  };
}
