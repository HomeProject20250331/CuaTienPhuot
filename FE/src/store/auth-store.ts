import { queryUtils, tokenManager } from "@/lib/api";
import { AuthState, User } from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore extends AuthState {
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  isLoggedIn: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: (user, accessToken, refreshToken) => {
        // Store tokens using tokenManager
        tokenManager.setTokens(accessToken, refreshToken);

        set({
          user,
          isAuthenticated: true,
          error: null,
        });
      },

      logout: () => {
        // Clear tokens using tokenManager
        tokenManager.clearTokens();

        // Clear all React Query cache
        queryUtils.clearAll();

        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      isLoggedIn: () => {
        const state = get();
        return (
          state.isAuthenticated &&
          state.user !== null &&
          tokenManager.isAuthenticated()
        );
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
