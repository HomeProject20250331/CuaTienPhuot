/**
 * Statistics API Hooks
 * Custom hooks cho Statistics sử dụng React Query
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "../axios-client";
import { apiClient } from "../axios-client";
import { API_CONFIG } from "../config";
import { queryKeys } from "../query-client";

// Types
export interface StatsSummary {
  totalExpenses: number;
  totalAmount: number;
  averageExpense: number;
  totalMembers: number;
  activeMembers: number;
  currency: string;
  period: {
    from: string;
    to: string;
  };
}

export interface CategoryStats {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  totalAmount: number;
  percentage: number;
  expenseCount: number;
  averageAmount: number;
}

export interface MemberStats {
  userId: string;
  userName: string;
  userAvatar?: string;
  totalPaid: number;
  totalOwed: number;
  balance: number;
  expenseCount: number;
  averageExpense: number;
}

export interface TimeStats {
  period: string; // 'day', 'week', 'month', 'year'
  data: {
    date: string;
    amount: number;
    count: number;
  }[];
}

export interface ExportRequest {
  format: "pdf" | "excel" | "csv";
  period: {
    from: string;
    to: string;
  };
  includeCharts?: boolean;
  includeDetails?: boolean;
}

export interface ExportResponse {
  downloadUrl: string;
  filename: string;
  expiresAt: string;
}

// API functions
const statisticsApi = {
  // Get stats summary
  getStatsSummary: async (
    groupId: string,
    params?: {
      from?: string;
      to?: string;
    }
  ): Promise<ApiResponse<StatsSummary>> => {
    const response = await apiClient.get<ApiResponse<StatsSummary>>(
      API_CONFIG.ENDPOINTS.STATISTICS.OVERVIEW(groupId),
      { params }
    );
    return response.data;
  },

  // Get stats by category
  getStatsByCategory: async (
    groupId: string,
    params?: {
      from?: string;
      to?: string;
      limit?: number;
    }
  ): Promise<ApiResponse<CategoryStats[]>> => {
    const response = await apiClient.get<ApiResponse<CategoryStats[]>>(
      API_CONFIG.ENDPOINTS.STATISTICS.EXPENSES(groupId).replace(
        "/expenses",
        "/by-category"
      ),
      { params }
    );
    return response.data;
  },

  // Get stats by member
  getStatsByMember: async (
    groupId: string,
    params?: {
      from?: string;
      to?: string;
    }
  ): Promise<ApiResponse<MemberStats[]>> => {
    const response = await apiClient.get<ApiResponse<MemberStats[]>>(
      API_CONFIG.ENDPOINTS.STATISTICS.MEMBERS(groupId),
      { params }
    );
    return response.data;
  },

  // Get stats by time
  getStatsByTime: async (
    groupId: string,
    params?: {
      from?: string;
      to?: string;
      period?: "day" | "week" | "month" | "year";
    }
  ): Promise<ApiResponse<TimeStats>> => {
    const response = await apiClient.get<ApiResponse<TimeStats>>(
      API_CONFIG.ENDPOINTS.STATISTICS.EXPENSES(groupId).replace(
        "/expenses",
        "/by-time"
      ),
      { params }
    );
    return response.data;
  },

  // Export stats report
  exportStats: async (
    groupId: string,
    data: ExportRequest
  ): Promise<ApiResponse<ExportResponse>> => {
    const response = await apiClient.post<ApiResponse<ExportResponse>>(
      API_CONFIG.ENDPOINTS.STATISTICS.EXPORT(groupId),
      data
    );
    return response.data;
  },
};

// Custom hooks
export function useStatsSummary(
  groupId: string,
  params?: {
    from?: string;
    to?: string;
  }
) {
  return useQuery({
    queryKey: [...queryKeys.groups.statsSummary(groupId), params],
    queryFn: () => statisticsApi.getStatsSummary(groupId, params),
    enabled: !!groupId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useStatsByCategory(
  groupId: string,
  params?: {
    from?: string;
    to?: string;
    limit?: number;
  }
) {
  return useQuery({
    queryKey: [...queryKeys.groups.statsByCategory(groupId), params],
    queryFn: () => statisticsApi.getStatsByCategory(groupId, params),
    enabled: !!groupId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useStatsByMember(
  groupId: string,
  params?: {
    from?: string;
    to?: string;
  }
) {
  return useQuery({
    queryKey: [...queryKeys.groups.statsByMember(groupId), params],
    queryFn: () => statisticsApi.getStatsByMember(groupId, params),
    enabled: !!groupId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useStatsByTime(
  groupId: string,
  params?: {
    from?: string;
    to?: string;
    period?: "day" | "week" | "month" | "year";
  }
) {
  return useQuery({
    queryKey: [...queryKeys.groups.statsByTime(groupId), params],
    queryFn: () => statisticsApi.getStatsByTime(groupId, params),
    enabled: !!groupId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useExportStats() {
  return useMutation({
    mutationFn: ({ groupId, data }: { groupId: string; data: ExportRequest }) =>
      statisticsApi.exportStats(groupId, data),
    onError: (error) => {
      console.error("Export stats failed:", error);
    },
  });
}

// Utility hook để invalidate tất cả stats khi có thay đổi
export function useInvalidateStats() {
  const queryClient = useQueryClient();

  return (groupId: string) => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.groups.stats(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.groups.statsSummary(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.groups.statsByCategory(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.groups.statsByMember(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.groups.statsByTime(groupId),
    });
  };
}
