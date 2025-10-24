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
  initializeAuth: () => void;
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

      initializeAuth: () => {
        // Kiểm tra authentication state từ tokenManager sau khi hydrate
        const isAuth = tokenManager.isAuthenticated();
        const currentState = get();

        if (isAuth && currentState.user) {
          set({ isAuthenticated: true });
        } else if (!isAuth) {
          set({ isAuthenticated: false, user: null });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        // Không persist isAuthenticated để tránh hydration mismatch
        // isAuthenticated sẽ được tính toán lại từ tokenManager sau khi hydrate
      }),
    }
  )
);
