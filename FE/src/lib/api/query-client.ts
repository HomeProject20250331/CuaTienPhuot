/**
 * React Query Configuration
 * Cấu hình QueryClient cho @tanstack/react-query
 */

import { QueryClient } from "@tanstack/react-query";

// Default query options
const defaultQueryOptions = {
  queries: {
    // Thời gian cache mặc định (5 phút)
    staleTime: 5 * 60 * 1000,
    // Thời gian cache trong bộ nhớ (10 phút)
    gcTime: 10 * 60 * 1000,
    // Retry failed requests
    retry: (failureCount: number, error: any) => {
      // Không retry cho 4xx errors (client errors)
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      // Retry tối đa 3 lần cho server errors
      return failureCount < 3;
    },
    // Retry delay với exponential backoff
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
    // Refetch on window focus
    refetchOnWindowFocus: false,
    // Refetch on reconnect
    refetchOnReconnect: true,
  },
  mutations: {
    // Retry mutations
    retry: (failureCount: number, error: any) => {
      // Không retry cho 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      // Retry tối đa 2 lần cho server errors
      return failureCount < 2;
    },
  },
};

// Tạo QueryClient instance
export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
});

// Query keys factory để đảm bảo consistency
export const queryKeys = {
  // Auth queries
  auth: {
    me: ["auth", "me"] as const,
    profile: ["auth", "profile"] as const,
  },

  // User queries
  users: {
    all: ["users"] as const,
    me: ["users", "me"] as const,
    groups: (userId?: string) => ["users", userId || "me", "groups"] as const,
    notifications: (userId?: string) =>
      ["users", userId || "me", "notifications"] as const,
  },

  // Group queries
  groups: {
    all: ["groups"] as const,
    detail: (id: string) => ["groups", id] as const,
    members: (id: string) => ["groups", id, "members"] as const,
    expenses: (id: string) => ["groups", id, "expenses"] as const,
    balances: (id: string) => ["groups", id, "balances"] as const,
    settlements: (id: string) => ["groups", id, "settlements"] as const,
    stats: (id: string) => ["groups", id, "stats"] as const,
    statsSummary: (id: string) => ["groups", id, "stats", "summary"] as const,
    statsByCategory: (id: string) =>
      ["groups", id, "stats", "by-category"] as const,
    statsByMember: (id: string) =>
      ["groups", id, "stats", "by-member"] as const,
    statsByTime: (id: string) => ["groups", id, "stats", "by-time"] as const,
  },

  // Expense queries
  expenses: {
    all: ["expenses"] as const,
    detail: (id: string) => ["expenses", id] as const,
    byGroup: (groupId: string) => ["expenses", "group", groupId] as const,
    categories: (groupId: string) =>
      ["expenses", "categories", groupId] as const,
  },

  // Settlement queries
  settlements: {
    all: ["settlements"] as const,
    detail: (id: string) => ["settlements", id] as const,
    byGroup: (groupId: string) => ["settlements", "group", groupId] as const,
  },

  // Notification queries
  notifications: {
    all: ["notifications"] as const,
    unread: ["notifications", "unread"] as const,
    settings: ["notifications", "settings"] as const,
  },
} as const;

// Utility functions cho query invalidation
export const queryUtils = {
  // Invalidate all auth queries
  invalidateAuth: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    queryClient.invalidateQueries({ queryKey: queryKeys.users.me });
  },

  // Invalidate all group queries
  invalidateGroups: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.groups.all });
  },

  // Invalidate specific group queries
  invalidateGroup: (groupId: string) => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.groups.detail(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.groups.members(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.groups.expenses(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.groups.balances(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.groups.settlements(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.groups.stats(groupId),
    });
  },

  // Invalidate expense queries
  invalidateExpenses: (groupId?: string) => {
    if (groupId) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.expenses.byGroup(groupId),
      });
    } else {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
    }
  },

  // Invalidate notification queries
  invalidateNotifications: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
  },

  // Clear all queries (useful for logout)
  clearAll: () => {
    queryClient.clear();
  },
};
