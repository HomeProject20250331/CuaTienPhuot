/**
 * LocalStorage utilities cho authentication
 * Sử dụng localStorage để lưu trữ trạng thái đăng nhập
 */

export const authStorage = {
  // Client-side operations
  setTokens: (accessToken: string, refreshToken: string) => {
    if (typeof window === "undefined") return;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("isAuthenticated", "true");
  },

  setUser: (user: any) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("user", JSON.stringify(user));
  },

  getAccessToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  },

  getRefreshToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refreshToken");
  },

  getUser: () => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated: () => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("isAuthenticated") === "true";
  },

  clearTokens: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
  },
};
