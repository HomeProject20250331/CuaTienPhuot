/**
 * API Hooks Index
 * Export tất cả custom hooks cho API
 */

// Query client và provider
export { queryClient, queryKeys, queryUtils } from "../query-client";
export { QueryProvider } from "../query-provider";

// Axios client và utilities
export type { ApiResponse, PaginatedResponse } from "../../../types/api";
export { apiClient, apiUtils, tokenManager } from "../axios-client";

// Auth hooks (Legacy - consider migrating to Server Actions)
export {
  useAuth,
  useChangePassword,
  useCurrentUser,
  useForgotPassword,
  useLogin,
  useLogout,
  useRegister,
  useResetPassword,
  useUpdateProfile,
} from "./auth";

export type {
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  User,
} from "./auth";

// Groups hooks
export {
  useAddMember,
  useCreateGroup,
  useDeleteGroup,
  useGroup,
  useGroupMembers,
  useGroups,
  useLeaveGroup,
  useRemoveMember,
  useUpdateGroup,
  useUpdateGroupSettings,
} from "./groups";

export type {
  AddMemberRequest,
  CreateGroupRequest,
  Group,
  GroupInviteLink,
  GroupMember,
  GroupSettings,
  UpdateGroupRequest,
  UpdateGroupSettingsRequest,
} from "./groups";

// Expenses hooks
export {
  // useCreateExpense,
  useCreateExpenseCategory,
  useDeleteExpense,
  useDeleteExpenseCategory,
  useExpense,
  useExpenseCategories,
  useExpenses,
  useUpdateExpense,
  useUpdateExpenseCategory,
  useUploadReceipt,
} from "./expenses";

export type {
  CreateExpenseCategoryRequest,
  CreateExpenseRequest,
  Expense,
  ExpenseCategory,
  ExpenseParticipant,
  UpdateExpenseCategoryRequest,
  UpdateExpenseRequest,
} from "./expenses";

// Settlements hooks
export {
  useBalances,
  useCalculateSettlements,
  useCancelSettlement,
  useCreatePaymentFormula,
  useCreateSettlement,
  useDeletePaymentFormula,
  useMarkSettlementPaid,
  usePaymentFormulas,
  useSettlement,
  useSettlements,
  useUpdatePaymentFormula,
} from "./settlements";

export type {
  Balance,
  CreatePaymentFormulaRequest,
  CreateSettlementRequest,
  PaymentFormula,
  Settlement,
  UpdatePaymentFormulaRequest,
} from "./settlements";

// Statistics hooks
export {
  useExportStats,
  useInvalidateStats,
  useStatsByCategory,
  useStatsByMember,
  useStatsByTime,
  useStatsSummary,
} from "./statistics";

export type {
  CategoryStats,
  ExportRequest,
  ExportResponse,
  MemberStats,
  StatsSummary,
  TimeStats,
} from "./statistics";

// Notifications hooks
export {
  useDeleteNotification,
  useInvalidateNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
  useNotificationSettings,
  useUnreadNotificationsCount,
  useUpdateNotificationSettings,
} from "./notifications";

export type {
  Notification,
  NotificationSettings,
  UpdateNotificationSettingsRequest,
} from "./notifications";
