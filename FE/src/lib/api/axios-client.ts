/**
 * Axios Instance Configuration
 * Cấu hình axios với interceptors cho authentication và error handling
 */

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { API_CONFIG } from "./config";

// Types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  timestamp: string;
}

interface PaginationResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Token management
class TokenManager {
  private static instance: TokenManager;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  setTokens(accessToken: string, refreshToken?: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken || null;

    // Store in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    }
  }

  getAccessToken(): string | null {
    if (!this.accessToken && typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("accessToken");
    }
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    if (!this.refreshToken && typeof window !== "undefined") {
      this.refreshToken = localStorage.getItem("refreshToken");
    }
    return this.refreshToken;
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;

    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// Create axios instance
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.DEFAULT_HEADERS,
  });

  const tokenManager = TokenManager.getInstance();

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add auth token to requests
      const token = tokenManager.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log request in development
      if (process.env.NODE_ENV === "development") {
        console.log(
          `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
          {
            data: config.data,
            params: config.params,
          }
        );
      }

      return config;
    },
    (error) => {
      console.error("❌ Request Error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      // Log response in development
      if (process.env.NODE_ENV === "development") {
        console.log(`✅ API Response: ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
      }

      return response;
    },
    async (error: AxiosError<ApiResponse>) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // Log error in development
      if (process.env.NODE_ENV === "development") {
        console.error(`❌ API Error: ${originalRequest?.url}`, {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      }

      // Handle 401 Unauthorized
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Try to refresh token
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post(
              `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN}`,
              { refreshToken }
            );

            if (refreshResponse.data.success) {
              const { accessToken, refreshToken: newRefreshToken } =
                refreshResponse.data.data;
              tokenManager.setTokens(accessToken, newRefreshToken);

              // Retry original request with new token
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }
              return instance(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            tokenManager.clearTokens();
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
        } else {
          // No refresh token, redirect to login
          tokenManager.clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Export axios instance
export const apiClient = createAxiosInstance();

// Export token manager
export const tokenManager = TokenManager.getInstance();

// Export types
export type { ApiResponse, PaginationResponse };

// Utility functions
export const apiUtils = {
  // Build query string from object
  buildQueryString: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((item) => searchParams.append(key, String(item)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    return searchParams.toString();
  },

  // Build URL with query parameters
  buildUrl: (path: string, params?: Record<string, any>): string => {
    if (!params || Object.keys(params).length === 0) {
      return path;
    }

    const queryString = apiUtils.buildQueryString(params);
    return queryString ? `${path}?${queryString}` : path;
  },

  // Format currency
  formatCurrency: (amount: number, currency: string = "VNĐ"): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace("₫", currency);
  },

  // Format date
  formatDate: (
    date: Date | string,
    format: "short" | "long" = "short"
  ): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (format === "long") {
      return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(dateObj);
    }

    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(dateObj);
  },

  // Validate email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  validatePassword: (
    password: string
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Mật khẩu phải có ít nhất 8 ký tự");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Mật khẩu phải có ít nhất 1 chữ hoa");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Mật khẩu phải có ít nhất 1 chữ thường");
    }

    if (!/\d/.test(password)) {
      errors.push("Mật khẩu phải có ít nhất 1 số");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Debounce function
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
};
