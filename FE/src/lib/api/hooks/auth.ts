"use client";

/**
 * Authentication API Hooks
 * Custom hooks cho authentication sử dụng React Query
 */

import { authStorage } from "@/lib/auth/localStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { ApiResponse } from "../axios-client";
import { apiClient, tokenManager } from "../axios-client";
import { API_CONFIG } from "../config";
import { queryKeys, queryUtils } from "../query-client";

// Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// API functions
const authApi = {
  // Login
  login: async (
    credentials: LoginRequest
  ): Promise<ApiResponse<AuthResponse>> => {
    const client = apiClient;
    const response = await client.post<ApiResponse<AuthResponse>>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  },

  // Register
  register: async (
    userData: RegisterRequest
  ): Promise<ApiResponse<AuthResponse>> => {
    const client = apiClient;
    const response = await client.post<ApiResponse<AuthResponse>>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      userData
    );
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const client = apiClient;
    const response = await client.get<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.AUTH.ME
    );
    return response.data;
  },

  // Update profile
  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<ApiResponse<User>> => {
    const client = apiClient;
    const response = await client.put<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.USERS.UPDATE_PROFILE,
      data
    );
    return response.data;
  },

  // Change password
  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<ApiResponse<void>> => {
    const client = apiClient;
    const response = await client.put<ApiResponse<void>>(
      API_CONFIG.ENDPOINTS.USERS.CHANGE_PASSWORD,
      data
    );
    return response.data;
  },

  // Forgot password
  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<ApiResponse<void>> => {
    const client = apiClient;
    const response = await client.post<ApiResponse<void>>(
      API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data
    );
    return response.data;
  },

  // Reset password
  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<ApiResponse<void>> => {
    const client = apiClient;
    const response = await client.post<ApiResponse<void>>(
      API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    );
    return response.data;
  },

  // Logout
  logout: async (): Promise<ApiResponse<void>> => {
    const client = apiClient;
    const response = await client.post<ApiResponse<void>>(
      API_CONFIG.ENDPOINTS.AUTH.LOGOUT
    );
    return response.data;
  },
};

// Custom hooks
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      console.log("Login success:", response);
      if (response.success && response.data) {
        // Store tokens
        tokenManager.setTokens(
          response.data.accessToken,
          response.data.refreshToken
        );

        // Invalidate and refetch user data
        queryUtils.invalidateAuth();

        // Set user data in cache
        queryClient.setQueryData(queryKeys.auth.me, response.data.user);
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Store tokens
        tokenManager.setTokens(
          response.data.accessToken,
          response.data.refreshToken
        );

        // Invalidate and refetch user data
        queryUtils.invalidateAuth();

        // Set user data in cache
        queryClient.setQueryData(queryKeys.auth.me, response.data.user);
      }
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authApi.getCurrentUser,
    enabled: tokenManager.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized)
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update user data in cache
        queryClient.setQueryData(queryKeys.auth.me, response.data);
        queryClient.setQueryData(queryKeys.users.me, response.data);
      }
    },
    onError: (error) => {
      console.error("Update profile failed:", error);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword,
    onError: (error) => {
      console.error("Change password failed:", error);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onError: (error) => {
      console.error("Forgot password failed:", error);
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onError: (error) => {
      console.error("Reset password failed:", error);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear tokens
      tokenManager.clearTokens();

      // Clear all queries
      queryUtils.clearAll();

      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Even if logout fails on server, clear local data
      tokenManager.clearTokens();
      queryUtils.clearAll();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    },
  });
}

// Utility hook để check authentication status
// Sử dụng localStorage thay vì cookies
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = () => {
      if (typeof window === "undefined") {
        setIsLoading(false);
        return;
      }

      try {
        // Đọc user data từ localStorage
        const userData = authStorage.getUser();
        const isAuth = authStorage.isAuthenticated();

        setUser(userData);
        setIsAuthenticated(isAuth);
      } catch (error) {
        console.error("Error parsing auth data:", error);
        setUser(null);
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Debug logging
  if (typeof window !== "undefined") {
    console.log("useAuth debug:", {
      user,
      isAuthenticated,
      isLoading,
    });
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    error: null,
  };
}
