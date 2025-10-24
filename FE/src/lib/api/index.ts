/**
 * API Services Index
 * Export tất cả API services và utilities với React Query
 */

// Configuration
export { API_CONFIG } from "./config";
export type { ApiConfig } from "./config";

// React Query setup
export { queryClient, queryKeys, queryUtils } from "./query-client";
export { QueryProvider } from "./query-provider";

// Axios client và utilities
export type { ApiResponse, PaginatedResponse } from "../../types/api";
export { apiClient, apiUtils, tokenManager } from "./axios-client";

// Export all React Query hooks
export * from "./hooks";

// Re-export commonly used types
export type { User } from "@/types/auth";
