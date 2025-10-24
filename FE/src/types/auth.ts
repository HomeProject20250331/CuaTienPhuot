export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  avatarThumbnail?: string;
  phone?: string;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  preferences?: {
    language: "vi" | "en";
    timezone: string;
    currency: "VND" | "USD" | "EUR";
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
