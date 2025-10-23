/**
 * Application Routes Constants
 * Tập trung quản lý tất cả các đường dẫn trong ứng dụng
 */

export const ROUTES = {
  // Public routes
  HOME: "/",

  // Auth routes
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },

  // Dashboard routes
  DASHBOARD: {
    HOME: "/dashboard",
    PROFILE: "/profile",
    SETTINGS: "/settings",
    NOTIFICATIONS: "/notifications",
  },

  // Group routes
  GROUPS: {
    LIST: "/groups",
    DETAIL: (id: string) => `/groups/${id}`,
    BALANCES: (id: string) => `/groups/${id}/balances`,
    EXPENSES: (id: string) => `/groups/${id}/expenses`,
    SETTINGS: (id: string) => `/groups/${id}/settings`,
    STATS: (id: string) => `/groups/${id}/stats`,
  },
} as const;

// Helper functions for dynamic routes
export const createGroupRoute = (id: string, subPath?: string) => {
  const basePath = `/groups/${id}`;
  return subPath ? `${basePath}/${subPath}` : basePath;
};

// Route validation helpers
export const isAuthRoute = (path: string): boolean => {
  return Object.values(ROUTES.AUTH).includes(path as any);
};

export const isDashboardRoute = (path: string): boolean => {
  return (
    path.startsWith("/dashboard") ||
    path.startsWith("/profile") ||
    path.startsWith("/settings") ||
    path.startsWith("/notifications") ||
    path.startsWith("/groups")
  );
};
