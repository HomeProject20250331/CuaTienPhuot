/**
 * Notifications API Hooks
 * Custom hooks cho Notifications sử dụng React Query
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse, PaginatedResponse } from "../../../types/api";
import { apiClient } from "../axios-client";
import { API_CONFIG } from "../config";
import { queryKeys } from "../query-client";

// Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  category: "expense" | "settlement" | "group" | "system";
  isRead: boolean;
  data?: Record<string, any>; // Additional data for the notification
  createdAt: string;
  readAt?: string;
}

export interface NotificationSettings {
  email: {
    newExpense: boolean;
    newSettlement: boolean;
    groupInvite: boolean;
    systemUpdates: boolean;
  };
  push: {
    newExpense: boolean;
    newSettlement: boolean;
    groupInvite: boolean;
    systemUpdates: boolean;
  };
  inApp: {
    newExpense: boolean;
    newSettlement: boolean;
    groupInvite: boolean;
    systemUpdates: boolean;
  };
}

export interface UpdateNotificationSettingsRequest {
  email?: {
    newExpense?: boolean;
    newSettlement?: boolean;
    groupInvite?: boolean;
    systemUpdates?: boolean;
  };
  push?: {
    newExpense?: boolean;
    newSettlement?: boolean;
    groupInvite?: boolean;
    systemUpdates?: boolean;
  };
  inApp?: {
    newExpense?: boolean;
    newSettlement?: boolean;
    groupInvite?: boolean;
    systemUpdates?: boolean;
  };
}

// API functions
const notificationsApi = {
  // Get notifications list
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    isRead?: boolean;
    category?: string;
    type?: string;
  }): Promise<PaginatedResponse<Notification>> => {
    const response = await apiClient.get<PaginatedResponse<Notification>>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST,
      { params }
    );
    return response.data;
  },

  // Get unread notifications count
  getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await apiClient.get<ApiResponse<{ count: number }>>(
      `${API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST}/unread-count`
    );
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.put<ApiResponse<void>>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId)
    );
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.put<ApiResponse<void>>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ
    );
    return response.data;
  },

  // Delete notification
  deleteNotification: async (
    notificationId: string
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST}/${notificationId}`
    );
    return response.data;
  },

  // Get notification settings
  getNotificationSettings: async (): Promise<
    ApiResponse<NotificationSettings>
  > => {
    const response = await apiClient.get<ApiResponse<NotificationSettings>>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.SETTINGS
    );
    return response.data;
  },

  // Update notification settings
  updateNotificationSettings: async (
    data: UpdateNotificationSettingsRequest
  ): Promise<ApiResponse<NotificationSettings>> => {
    const response = await apiClient.put<ApiResponse<NotificationSettings>>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.SETTINGS,
      data
    );
    return response.data;
  },
};

// Custom hooks
export function useNotifications(params?: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  isRead?: boolean;
  category?: string;
  type?: string;
}) {
  return useQuery({
    queryKey: [...queryKeys.notifications.all, params],
    queryFn: () => notificationsApi.getNotifications(params),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: queryKeys.notifications.unread,
    queryFn: () => notificationsApi.getUnreadCount(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: queryKeys.notifications.settings,
    queryFn: notificationsApi.getNotificationSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: (response, notificationId) => {
      if (response.success) {
        // Update notification in cache
        queryClient.setQueryData(
          [...queryKeys.notifications.all],
          (oldData: PaginatedResponse<Notification> | undefined) => {
            if (!oldData?.data) return oldData;

            return {
              ...oldData,
              data: oldData.data.map((notification) =>
                notification.id === notificationId
                  ? {
                      ...notification,
                      isRead: true,
                      readAt: new Date().toISOString(),
                    }
                  : notification
              ),
            };
          }
        );

        // Invalidate unread count
        queryClient.invalidateQueries({
          queryKey: queryKeys.notifications.unread,
        });
      }
    },
    onError: (error) => {
      console.error("Mark notification as read failed:", error);
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: (response) => {
      if (response.success) {
        // Update all notifications in cache
        queryClient.setQueryData(
          [...queryKeys.notifications.all],
          (oldData: PaginatedResponse<Notification> | undefined) => {
            if (!oldData?.data) return oldData;

            return {
              ...oldData,
              data: oldData.data.map((notification) => ({
                ...notification,
                isRead: true,
                readAt: new Date().toISOString(),
              })),
            };
          }
        );

        // Invalidate unread count
        queryClient.invalidateQueries({
          queryKey: queryKeys.notifications.unread,
        });
      }
    },
    onError: (error) => {
      console.error("Mark all notifications as read failed:", error);
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.deleteNotification,
    onSuccess: (response, notificationId) => {
      if (response.success) {
        // Remove notification from cache
        queryClient.setQueryData(
          [...queryKeys.notifications.all],
          (oldData: PaginatedResponse<Notification> | undefined) => {
            if (!oldData?.data) return oldData;

            return {
              ...oldData,
              data: oldData.data.filter(
                (notification) => notification.id !== notificationId
              ),
              pagination: oldData.pagination
                ? {
                    ...oldData.pagination,
                    total: oldData.pagination.total - 1,
                  }
                : undefined,
            };
          }
        );

        // Invalidate unread count
        queryClient.invalidateQueries({
          queryKey: queryKeys.notifications.unread,
        });
      }
    },
    onError: (error) => {
      console.error("Delete notification failed:", error);
    },
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.updateNotificationSettings,
    onSuccess: (response) => {
      if (response.success) {
        // Update settings in cache
        queryClient.setQueryData(queryKeys.notifications.settings, response);
      }
    },
    onError: (error) => {
      console.error("Update notification settings failed:", error);
    },
  });
}

// Utility hook để invalidate notifications
export function useInvalidateNotifications() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unread });
  };
}
