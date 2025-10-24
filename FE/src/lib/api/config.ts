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
    },
    USERS: {
      PROFILE: "/users/me",
      UPDATE_PROFILE: "/users/me",
      CHANGE_PASSWORD: "/users/me/password",
      UPLOAD_AVATAR: "/users/me/avatar",
      DELETE_AVATAR: "/users/me/avatar",
      MY_GROUPS: "/users/me/groups",
      MY_NOTIFICATIONS: "/users/me/notifications",
    },
    GROUPS: {
      LIST: "/groups",
      CREATE: "/groups",
      DETAIL: (id: string) => `/groups/${id}`,
      UPDATE: (id: string) => `/groups/${id}`,
      DELETE: (id: string) => `/groups/${id}`,
      MEMBERS: (id: string) => `/groups/${id}/members`,
      ADD_MEMBER: (id: string) => `/groups/${id}/members`,
      REMOVE_MEMBER: (id: string, userId: string) =>
        `/groups/${id}/members/${userId}`,
      INVITE_LINK: (id: string) => `/groups/${id}/invite-link`,
      JOIN: "/groups/join",
      LEAVE: (id: string) => `/groups/${id}/leave`,
      SETTINGS: (id: string) => `/groups/${id}/settings`,
    },
    EXPENSES: {
      LIST: (groupId: string) => `/groups/${groupId}/expenses`,
      CREATE: (groupId: string) => `/groups/${groupId}/expenses`,
      DETAIL: (id: string) => `/expenses/${id}`,
      UPDATE: (id: string) => `/expenses/${id}`,
      DELETE: (id: string) => `/expenses/${id}`,
      UPLOAD_RECEIPT: (id: string) => `/expenses/${id}/upload-receipt`,
      DELETE_RECEIPT: (id: string) => `/expenses/${id}/receipt`,
      PARTICIPANTS: (id: string) => `/expenses/${id}/participants`,
    },
    SETTLEMENTS: {
      BALANCES: (groupId: string) => `/groups/${groupId}/balances`,
      BALANCES_SUMMARY: (groupId: string) =>
        `/groups/${groupId}/balances/summary`,
      BALANCES_OPTIMIZE: (groupId: string) =>
        `/groups/${groupId}/balances/optimize`,
      LIST: (groupId: string) => `/groups/${groupId}/settlements`,
      CREATE: (groupId: string) => `/groups/${groupId}/settlements`,
      DETAIL: (id: string) => `/settlements/${id}`,
      MARK_PAID: (id: string) => `/settlements/${id}/mark-paid`,
      CANCEL: (id: string) => `/settlements/${id}/cancel`,
    },
    STATISTICS: {
      SUMMARY: (groupId: string) => `/groups/${groupId}/stats/summary`,
      BY_CATEGORY: (groupId: string) => `/groups/${groupId}/stats/by-category`,
      BY_MEMBER: (groupId: string) => `/groups/${groupId}/stats/by-member`,
      BY_TIME: (groupId: string) => `/groups/${groupId}/stats/by-time`,
      EXPENSES: (groupId: string) => `/groups/${groupId}/stats/expenses`,
      INSIGHTS: (groupId: string) => `/groups/${groupId}/stats/insights`,
      EXPORT: (groupId: string) => `/groups/${groupId}/export`,
      EXPORT_STATUS: (exportId: string) => `/exports/${exportId}`,
    },
    NOTIFICATIONS: {
      LIST: "/notifications",
      DETAIL: (id: string) => `/notifications/${id}`,
      MARK_READ: (id: string) => `/notifications/${id}/read`,
      MARK_ALL_READ: "/notifications/read-all",
      DELETE: (id: string) => `/notifications/${id}`,
      DELETE_ALL: "/notifications/delete-all",
      SUMMARY: "/notifications/summary",
      PREFERENCES: "/notifications/preferences",
    },
  },

  // Request headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
} as const;

export type ApiConfig = typeof API_CONFIG;
