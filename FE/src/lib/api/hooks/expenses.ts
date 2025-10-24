/**
 * Expenses API Hooks
 * Custom hooks cho Expenses sử dụng React Query
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse, PaginationResponse } from "../axios-client";
import { apiClient } from "../axios-client";
import { API_CONFIG } from "../config";
import { queryKeys } from "../query-client";

// Types
export interface Expense {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  paidBy: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  participants: ExpenseParticipant[];
  receipt?: {
    id: string;
    url: string;
    filename: string;
    uploadedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
  groupId: string;
}

export interface ExpenseParticipant {
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  amount: number;
  isPaid: boolean;
}

export interface CreateExpenseRequest {
  title: string;
  description?: string;
  amount: number;
  categoryId: string;
  paidByUserId: string;
  participants: {
    userId: string;
    amount: number;
  }[];
  receipt?: File;
}

export interface UpdateExpenseRequest {
  title?: string;
  description?: string;
  amount?: number;
  categoryId?: string;
  paidByUserId?: string;
  participants?: {
    userId: string;
    amount: number;
  }[];
}

export interface CreateExpenseCategoryRequest {
  name: string;
  color: string;
  icon?: string;
}

export interface UpdateExpenseCategoryRequest {
  name?: string;
  color?: string;
  icon?: string;
}

// API functions
const expensesApi = {
  // Get expenses list
  getExpenses: async (
    groupId: string,
    params?: {
      page?: number;
      limit?: number;
      sort?: string;
      order?: "asc" | "desc";
      categoryId?: string;
      paidByUserId?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<PaginationResponse<Expense>> => {
    const response = await apiClient.get<PaginationResponse<Expense>>(
      API_CONFIG.ENDPOINTS.EXPENSES.LIST(groupId),
      { params }
    );
    return response.data;
  },

  // Get expense detail
  getExpense: async (
    groupId: string,
    expenseId: string
  ): Promise<ApiResponse<Expense>> => {
    const response = await apiClient.get<ApiResponse<Expense>>(
      API_CONFIG.ENDPOINTS.EXPENSES.DETAIL(groupId, expenseId)
    );
    return response.data;
  },

  // Create expense
  createExpense: async (
    groupId: string,
    data: CreateExpenseRequest
  ): Promise<ApiResponse<Expense>> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("amount", data.amount.toString());
    formData.append("categoryId", data.categoryId);
    formData.append("paidByUserId", data.paidByUserId);
    formData.append("participants", JSON.stringify(data.participants));

    if (data.description) {
      formData.append("description", data.description);
    }

    if (data.receipt) {
      formData.append("receipt", data.receipt);
    }

    const response = await apiClient.post<ApiResponse<Expense>>(
      API_CONFIG.ENDPOINTS.EXPENSES.CREATE(groupId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Update expense
  updateExpense: async (
    groupId: string,
    expenseId: string,
    data: UpdateExpenseRequest
  ): Promise<ApiResponse<Expense>> => {
    const response = await apiClient.put<ApiResponse<Expense>>(
      API_CONFIG.ENDPOINTS.EXPENSES.UPDATE(groupId, expenseId),
      data
    );
    return response.data;
  },

  // Delete expense
  deleteExpense: async (
    groupId: string,
    expenseId: string
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_CONFIG.ENDPOINTS.EXPENSES.DELETE(groupId, expenseId)
    );
    return response.data;
  },

  // Upload receipt
  uploadReceipt: async (
    groupId: string,
    expenseId: string,
    file: File
  ): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append("receipt", file);

    const response = await apiClient.post<ApiResponse<{ url: string }>>(
      `${API_CONFIG.ENDPOINTS.EXPENSES.DETAIL(groupId, expenseId)}/receipt`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Get expense categories
  getExpenseCategories: async (
    groupId: string
  ): Promise<ApiResponse<ExpenseCategory[]>> => {
    const response = await apiClient.get<ApiResponse<ExpenseCategory[]>>(
      `${API_CONFIG.ENDPOINTS.EXPENSES.LIST(groupId)}/categories`
    );
    return response.data;
  },

  // Create expense category
  createExpenseCategory: async (
    groupId: string,
    data: CreateExpenseCategoryRequest
  ): Promise<ApiResponse<ExpenseCategory>> => {
    const response = await apiClient.post<ApiResponse<ExpenseCategory>>(
      `${API_CONFIG.ENDPOINTS.EXPENSES.LIST(groupId)}/categories`,
      data
    );
    return response.data;
  },

  // Update expense category
  updateExpenseCategory: async (
    groupId: string,
    categoryId: string,
    data: UpdateExpenseCategoryRequest
  ): Promise<ApiResponse<ExpenseCategory>> => {
    const response = await apiClient.put<ApiResponse<ExpenseCategory>>(
      `${API_CONFIG.ENDPOINTS.EXPENSES.LIST(groupId)}/categories/${categoryId}`,
      data
    );
    return response.data;
  },

  // Delete expense category
  deleteExpenseCategory: async (
    groupId: string,
    categoryId: string
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API_CONFIG.ENDPOINTS.EXPENSES.LIST(groupId)}/categories/${categoryId}`
    );
    return response.data;
  },
};

// Custom hooks
export function useExpenses(
  groupId: string,
  params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    categoryId?: string;
    paidByUserId?: string;
    dateFrom?: string;
    dateTo?: string;
  }
) {
  return useQuery({
    queryKey: [...queryKeys.expenses.byGroup(groupId), params],
    queryFn: () => expensesApi.getExpenses(groupId, params),
    enabled: !!groupId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useExpense(groupId: string, expenseId: string) {
  return useQuery({
    queryKey: queryKeys.expenses.detail(expenseId),
    queryFn: () => expensesApi.getExpense(groupId, expenseId),
    enabled: !!groupId && !!expenseId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useExpenseCategories(groupId: string) {
  return useQuery({
    queryKey: queryKeys.expenses.categories(groupId),
    queryFn: () => expensesApi.getExpenseCategories(groupId),
    enabled: !!groupId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: CreateExpenseRequest;
    }) => expensesApi.createExpense(groupId, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate expenses list
        queryClient.invalidateQueries({
          queryKey: queryKeys.expenses.byGroup(variables.groupId),
        });

        // Invalidate group balances
        queryClient.invalidateQueries({
          queryKey: queryKeys.groups.balances(variables.groupId),
        });

        // Invalidate group stats
        queryClient.invalidateQueries({
          queryKey: queryKeys.groups.stats(variables.groupId),
        });
      }
    },
    onError: (error) => {
      console.error("Create expense failed:", error);
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      expenseId,
      data,
    }: {
      groupId: string;
      expenseId: string;
      data: UpdateExpenseRequest;
    }) => expensesApi.updateExpense(groupId, expenseId, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Update expense in cache
        queryClient.setQueryData(
          queryKeys.expenses.detail(variables.expenseId),
          response
        );

        // Invalidate expenses list
        queryClient.invalidateQueries({
          queryKey: queryKeys.expenses.byGroup(variables.groupId),
        });

        // Invalidate group balances
        queryClient.invalidateQueries({
          queryKey: queryKeys.groups.balances(variables.groupId),
        });

        // Invalidate group stats
        queryClient.invalidateQueries({
          queryKey: queryKeys.groups.stats(variables.groupId),
        });
      }
    },
    onError: (error) => {
      console.error("Update expense failed:", error);
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      expenseId,
    }: {
      groupId: string;
      expenseId: string;
    }) => expensesApi.deleteExpense(groupId, expenseId),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Remove expense from cache
        queryClient.removeQueries({
          queryKey: queryKeys.expenses.detail(variables.expenseId),
        });

        // Invalidate expenses list
        queryClient.invalidateQueries({
          queryKey: queryKeys.expenses.byGroup(variables.groupId),
        });

        // Invalidate group balances
        queryClient.invalidateQueries({
          queryKey: queryKeys.groups.balances(variables.groupId),
        });

        // Invalidate group stats
        queryClient.invalidateQueries({
          queryKey: queryKeys.groups.stats(variables.groupId),
        });
      }
    },
    onError: (error) => {
      console.error("Delete expense failed:", error);
    },
  });
}

export function useUploadReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      expenseId,
      file,
    }: {
      groupId: string;
      expenseId: string;
      file: File;
    }) => expensesApi.uploadReceipt(groupId, expenseId, file),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate expense detail to refresh receipt data
        queryClient.invalidateQueries({
          queryKey: queryKeys.expenses.detail(variables.expenseId),
        });
      }
    },
    onError: (error) => {
      console.error("Upload receipt failed:", error);
    },
  });
}

export function useCreateExpenseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: CreateExpenseCategoryRequest;
    }) => expensesApi.createExpenseCategory(groupId, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate expense categories
        queryClient.invalidateQueries({
          queryKey: queryKeys.expenses.categories(variables.groupId),
        });
      }
    },
    onError: (error) => {
      console.error("Create expense category failed:", error);
    },
  });
}

export function useUpdateExpenseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      categoryId,
      data,
    }: {
      groupId: string;
      categoryId: string;
      data: UpdateExpenseCategoryRequest;
    }) => expensesApi.updateExpenseCategory(groupId, categoryId, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate expense categories
        queryClient.invalidateQueries({
          queryKey: queryKeys.expenses.categories(variables.groupId),
        });
      }
    },
    onError: (error) => {
      console.error("Update expense category failed:", error);
    },
  });
}

export function useDeleteExpenseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      categoryId,
    }: {
      groupId: string;
      categoryId: string;
    }) => expensesApi.deleteExpenseCategory(groupId, categoryId),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate expense categories
        queryClient.invalidateQueries({
          queryKey: queryKeys.expenses.categories(variables.groupId),
        });
      }
    },
    onError: (error) => {
      console.error("Delete expense category failed:", error);
    },
  });
}
