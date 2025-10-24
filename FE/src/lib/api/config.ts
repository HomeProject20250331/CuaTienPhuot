/**
 * API Configuration
 * Cấu hình cho API service
 */

export const API_CONFIG = {
  // Base URL cho API
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",

  // Timeout cho requests (ms)
  TIMEOUT: 10000,

  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
      REFRESH_TOKEN: "/auth/refresh-token",
      FORGOT_PASSWORD: "/auth/forgot-password",
      RESET_PASSWORD: "/auth/reset-password",
      VERIFY_EMAIL: "/auth/verify-email",
      ME: "/auth/me",
    },
    USERS: {
      PROFILE: "/users/me",
      UPDATE_PROFILE: "/users/me",
      CHANGE_PASSWORD: "/users/me/password",
      UPLOAD_AVATAR: "/users/me/avatar",
    },
    GROUPS: {
      LIST: "/groups",
      CREATE: "/groups",
      DETAIL: (id: string) => `/groups/${id}`,
      UPDATE: (id: string) => `/groups/${id}`,
      DELETE: (id: string) => `/groups/${id}`,
      MEMBERS: (id: string) => `/groups/${id}/members`,
      INVITE: (id: string) => `/groups/${id}/invite`,
      LEAVE: (id: string) => `/groups/${id}/leave`,
    },
    EXPENSES: {
      LIST: (groupId: string) => `/groups/${groupId}/expenses`,
      CREATE: (groupId: string) => `/groups/${groupId}/expenses`,
      DETAIL: (groupId: string, expenseId: string) =>
        `/groups/${groupId}/expenses/${expenseId}`,
      UPDATE: (groupId: string, expenseId: string) =>
        `/groups/${groupId}/expenses/${expenseId}`,
      DELETE: (groupId: string, expenseId: string) =>
        `/groups/${groupId}/expenses/${expenseId}`,
    },
    SETTLEMENTS: {
      LIST: (groupId: string) => `/groups/${groupId}/settlements`,
      CREATE: (groupId: string) => `/groups/${groupId}/settlements`,
      CONFIRM: (groupId: string, settlementId: string) =>
        `/groups/${groupId}/settlements/${settlementId}/confirm`,
    },
    STATISTICS: {
      OVERVIEW: (groupId: string) => `/groups/${groupId}/stats/overview`,
      EXPENSES: (groupId: string) => `/groups/${groupId}/stats/expenses`,
      MEMBERS: (groupId: string) => `/groups/${groupId}/stats/members`,
      EXPORT: (groupId: string) => `/groups/${groupId}/stats/export`,
    },
    NOTIFICATIONS: {
      LIST: "/notifications",
      MARK_READ: (id: string) => `/notifications/${id}/read`,
      MARK_ALL_READ: "/notifications/read-all",
      SETTINGS: "/notifications/settings",
    },
  },

  // Request headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
} as const;

export type ApiConfig = typeof API_CONFIG;
