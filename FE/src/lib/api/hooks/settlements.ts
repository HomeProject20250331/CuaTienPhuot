/**
 * Settlements API Hooks
 * Custom hooks cho Settlements sử dụng React Query
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse, PaginatedResponse } from "../../../types/api";
import { apiClient } from "../axios-client";
import { API_CONFIG } from "../config";
import { queryKeys } from "../query-client";

// Types
export interface Settlement {
  id: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "cancelled";
  description?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  fromUser: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  toUser: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface Balance {
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  totalPaid: number;
  totalOwed: number;
  balance: number; // positive = owed money, negative = owed to others
}

export interface PaymentFormula {
  id: string;
  groupId: string;
  name: string;
  description: string;
  formula: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSettlementRequest {
  fromUserId: string;
  toUserId: string;
  amount: number;
  description?: string;
}

export interface CreatePaymentFormulaRequest {
  name: string;
  description: string;
  formula: string;
  isDefault?: boolean;
}

export interface UpdatePaymentFormulaRequest {
  name?: string;
  description?: string;
  formula?: string;
  isDefault?: boolean;
}

// API functions
const settlementsApi = {
  // Get balances
  getBalances: async (groupId: string): Promise<ApiResponse<Balance[]>> => {
    const response = await apiClient.get<ApiResponse<Balance[]>>(
      API_CONFIG.ENDPOINTS.SETTLEMENTS.LIST(groupId).replace(
        "/settlements",
        "/balances"
      )
    );
    return response.data;
  },

  // Get settlements list
  getSettlements: async (
    groupId: string,
    params?: {
      page?: number;
      limit?: number;
      sort?: string;
      order?: "asc" | "desc";
      status?: "pending" | "paid" | "cancelled";
      userId?: string;
    }
  ): Promise<PaginatedResponse<Settlement>> => {
    const response = await apiClient.get<PaginatedResponse<Settlement>>(
      API_CONFIG.ENDPOINTS.SETTLEMENTS.LIST(groupId),
      { params }
    );
    return response.data;
  },

  // Get settlement detail
  getSettlement: async (
    groupId: string,
    settlementId: string
  ): Promise<ApiResponse<Settlement>> => {
    const response = await apiClient.get<ApiResponse<Settlement>>(
      `${API_CONFIG.ENDPOINTS.SETTLEMENTS.LIST(groupId)}/${settlementId}`
    );
    return response.data;
  },

  // Create settlement
  createSettlement: async (
    groupId: string,
    data: CreateSettlementRequest
  ): Promise<ApiResponse<Settlement>> => {
    const response = await apiClient.post<ApiResponse<Settlement>>(
      API_CONFIG.ENDPOINTS.SETTLEMENTS.CREATE(groupId),
      data
    );
    return response.data;
  },

  // Mark settlement as paid
  markSettlementPaid: async (
    groupId: string,
    settlementId: string
  ): Promise<ApiResponse<Settlement>> => {
    const response = await apiClient.put<ApiResponse<Settlement>>(
      API_CONFIG.ENDPOINTS.SETTLEMENTS.CONFIRM(groupId, settlementId)
    );
    return response.data;
  },

  // Cancel settlement
  cancelSettlement: async (
    groupId: string,
    settlementId: string
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API_CONFIG.ENDPOINTS.SETTLEMENTS.LIST(groupId)}/${settlementId}`
    );
    return response.data;
  },

  // Get payment formulas
  getPaymentFormulas: async (
    groupId: string
  ): Promise<ApiResponse<PaymentFormula[]>> => {
    const response = await apiClient.get<ApiResponse<PaymentFormula[]>>(
      `${API_CONFIG.ENDPOINTS.SETTLEMENTS.LIST(groupId)}/formulas`
    );
    return response.data;
  },

  // Create payment formula
  createPaymentFormula: async (
    groupId: string,
    data: CreatePaymentFormulaRequest
  ): Promise<ApiResponse<PaymentFormula>> => {
    const response = await apiClient.post<ApiResponse<PaymentFormula>>(
      `${API_CONFIG.ENDPOINTS.SETTLEMENTS.LIST(groupId)}/formulas`,
      data
    );
    return response.data;
  },

  // Update payment formula
  updatePaymentFormula: async (
    groupId: string,
    formulaId: string,
    data: UpdatePaymentFormulaRequest
  ): Promise<ApiResponse<PaymentFormula>> => {
    const response = await apiClient.put<ApiResponse<PaymentFormula>>(
      `${API_CONFIG.ENDPOINTS.SETTLEMENTS.LIST(groupId)}/formulas/${formulaId}`,
      data
    );
    return response.data;
  },

  // Delete payment formula
  deletePaymentFormula: async (
    groupId: string,
    formulaId: string
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API_CONFIG.ENDPOINTS.SETTLEMENTS.LIST(groupId)}/formulas/${formulaId}`
    );
    return response.data;
  },

  // Calculate settlements using formula
  calculateSettlements: async (
    groupId: string,
    formulaId?: string
  ): Promise<ApiResponse<Settlement[]>> => {
    const response = await apiClient.post<ApiResponse<Settlement[]>>(
      `${API_CONFIG.ENDPOINTS.SETTLEMENTS.LIST(groupId)}/calculate`,
      { formulaId }
    );
    return response.data;
  },
};

// Custom hooks
export function useBalances(groupId: string) {
  return useQuery({
    queryKey: queryKeys.groups.balances(groupId),
    queryFn: () => settlementsApi.getBalances(groupId),
    enabled: !!groupId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useSettlements(
  groupId: string,
  params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    status?: "pending" | "paid" | "cancelled";
    userId?: string;
  }
) {
  return useQuery({
    queryKey: [...queryKeys.settlements.byGroup(groupId), params],
    queryFn: () => settlementsApi.getSettlements(groupId, params),
    enabled: !!groupId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useSettlement(groupId: string, settlementId: string) {
  return useQuery({
    queryKey: queryKeys.settlements.detail(settlementId),
    queryFn: () => settlementsApi.getSettlement(groupId, settlementId),
    enabled: !!groupId && !!settlementId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function usePaymentFormulas(groupId: string) {
  return useQuery({
    queryKey: [...queryKeys.settlements.byGroup(groupId), "formulas"],
    queryFn: () => settlementsApi.getPaymentFormulas(groupId),
    enabled: !!groupId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateSettlement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: CreateSettlementRequest;
    }) => settlementsApi.createSettlement(groupId, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate settlements list
        queryClient.invalidateQueries({
          queryKey: queryKeys.settlements.byGroup(variables.groupId),
        });

        // Invalidate balances
        queryClient.invalidateQueries({
          queryKey: queryKeys.groups.balances(variables.groupId),
        });
      }
    },
    onError: (error) => {
      console.error("Create settlement failed:", error);
    },
  });
}

export function useMarkSettlementPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      settlementId,
    }: {
      groupId: string;
      settlementId: string;
    }) => settlementsApi.markSettlementPaid(groupId, settlementId),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Update settlement in cache
        queryClient.setQueryData(
          queryKeys.settlements.detail(variables.settlementId),
          response
        );

        // Invalidate settlements list
        queryClient.invalidateQueries({
          queryKey: queryKeys.settlements.byGroup(variables.groupId),
        });

        // Invalidate balances
        queryClient.invalidateQueries({
          queryKey: queryKeys.groups.balances(variables.groupId),
        });
      }
    },
    onError: (error) => {
      console.error("Mark settlement paid failed:", error);
    },
  });
}

export function useCancelSettlement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      settlementId,
    }: {
      groupId: string;
      settlementId: string;
    }) => settlementsApi.cancelSettlement(groupId, settlementId),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Remove settlement from cache
        queryClient.removeQueries({
          queryKey: queryKeys.settlements.detail(variables.settlementId),
        });

        // Invalidate settlements list
        queryClient.invalidateQueries({
          queryKey: queryKeys.settlements.byGroup(variables.groupId),
        });

        // Invalidate balances
        queryClient.invalidateQueries({
          queryKey: queryKeys.groups.balances(variables.groupId),
        });
      }
    },
    onError: (error) => {
      console.error("Cancel settlement failed:", error);
    },
  });
}

export function useCreatePaymentFormula() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: CreatePaymentFormulaRequest;
    }) => settlementsApi.createPaymentFormula(groupId, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate payment formulas
        queryClient.invalidateQueries({
          queryKey: [
            ...queryKeys.settlements.byGroup(variables.groupId),
            "formulas",
          ],
        });
      }
    },
    onError: (error) => {
      console.error("Create payment formula failed:", error);
    },
  });
}

export function useUpdatePaymentFormula() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      formulaId,
      data,
    }: {
      groupId: string;
      formulaId: string;
      data: UpdatePaymentFormulaRequest;
    }) => settlementsApi.updatePaymentFormula(groupId, formulaId, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate payment formulas
        queryClient.invalidateQueries({
          queryKey: [
            ...queryKeys.settlements.byGroup(variables.groupId),
            "formulas",
          ],
        });
      }
    },
    onError: (error) => {
      console.error("Update payment formula failed:", error);
    },
  });
}

export function useDeletePaymentFormula() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      formulaId,
    }: {
      groupId: string;
      formulaId: string;
    }) => settlementsApi.deletePaymentFormula(groupId, formulaId),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate payment formulas
        queryClient.invalidateQueries({
          queryKey: [
            ...queryKeys.settlements.byGroup(variables.groupId),
            "formulas",
          ],
        });
      }
    },
    onError: (error) => {
      console.error("Delete payment formula failed:", error);
    },
  });
}

export function useCalculateSettlements() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      formulaId,
    }: {
      groupId: string;
      formulaId?: string;
    }) => settlementsApi.calculateSettlements(groupId, formulaId),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate settlements list
        queryClient.invalidateQueries({
          queryKey: queryKeys.settlements.byGroup(variables.groupId),
        });

        // Invalidate balances
        queryClient.invalidateQueries({
          queryKey: queryKeys.groups.balances(variables.groupId),
        });
      }
    },
    onError: (error) => {
      console.error("Calculate settlements failed:", error);
    },
  });
}
