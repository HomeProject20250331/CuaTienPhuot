/**
 * API Types
 * Định nghĩa types cho API requests và responses
 */

import { User } from "./auth";

/**
 * Base API Response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details: string;
  };
}

/**
 * Pagination
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

/**
 * API Error
 */
export interface ApiError {
  code: string;
  message: string;
  details?: string;
  statusCode?: number;
}

/**
 * Request Options
 */
export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  signal?: AbortSignal;
}

/**
 * Auth API Types
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse
  extends ApiResponse<{
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
  success: boolean;
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse extends ApiResponse<AuthTokens> {}

/**
 * User API Types
 */
export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface UpdateProfileResponse extends ApiResponse<User> {}

export interface ChangePasswordResponse extends ApiResponse<null> {}

export interface UploadAvatarRequest {
  file: File;
}

export interface UploadAvatarResponse
  extends ApiResponse<{
    avatarUrl: string;
  }> {}

/**
 * Group API Types
 */
export interface Group {
  id: string;
  name: string;
  description: string;
  currency: string;
  memberCount: number;
  totalExpenses: number;
  status: "active" | "completed" | "archived";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
  members: GroupMember[];
  settings: GroupSettings;
}

export interface GroupMember {
  id: string;
  userId: string;
  user: User;
  role: "admin" | "member";
  joinedAt: string;
  isActive: boolean;
}

export interface GroupSettings {
  allowMemberInvite: boolean;
  requireApproval: boolean;
  defaultCurrency: string;
  splitMethod: "equal" | "proportional" | "item-based";
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  currency: string;
  settings?: Partial<GroupSettings>;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  settings?: Partial<GroupSettings>;
}

export interface InviteMemberRequest {
  email: string;
  role?: "admin" | "member";
}

export interface GroupsListResponse extends PaginatedResponse<Group> {}

export interface GroupDetailResponse extends ApiResponse<Group> {}

export interface CreateGroupResponse extends ApiResponse<Group> {}

export interface UpdateGroupResponse extends ApiResponse<Group> {}

export interface DeleteGroupResponse extends ApiResponse<null> {}

export interface InviteMemberResponse
  extends ApiResponse<{
    inviteToken: string;
    inviteUrl: string;
  }> {}

/**
 * Expense API Types
 */
export interface Expense {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  category: string;
  location?: string;
  date: string;
  paidBy: string;
  paidByUser: User;
  splitType: "equal" | "proportional" | "item-based";
  splitDetails: SplitDetail[];
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SplitDetail {
  userId: string;
  user: User;
  amount: number;
  percentage: number;
  isPaid: boolean;
  paidAt?: string;
}

export interface CreateExpenseRequest {
  title: string;
  description?: string;
  amount: number;
  category: string;
  location?: string;
  date: string;
  splitType: "equal" | "proportional" | "item-based";
  splitDetails: Omit<SplitDetail, "user" | "isPaid" | "paidAt">[];
  receipt?: File;
}

export interface UpdateExpenseRequest {
  title?: string;
  description?: string;
  amount?: number;
  category?: string;
  location?: string;
  date?: string;
  splitType?: "equal" | "proportional" | "item-based";
  splitDetails?: Omit<SplitDetail, "user" | "isPaid" | "paidAt">[];
  receipt?: File;
}

export interface ExpensesListResponse extends PaginatedResponse<Expense> {}

export interface ExpenseDetailResponse extends ApiResponse<Expense> {}

export interface CreateExpenseResponse extends ApiResponse<Expense> {}

export interface UpdateExpenseResponse extends ApiResponse<Expense> {}

export interface DeleteExpenseResponse extends ApiResponse<null> {}

/**
 * Settlement API Types
 */
export interface Settlement {
  id: string;
  groupId: string;
  fromUserId: string;
  fromUser: User;
  toUserId: string;
  toUser: User;
  amount: number;
  currency: string;
  status: "pending" | "confirmed" | "cancelled";
  description?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
}

export interface CreateSettlementRequest {
  fromUserId: string;
  toUserId: string;
  amount: number;
  description?: string;
}

export interface ConfirmSettlementRequest {
  settlementId: string;
}

export interface SettlementsListResponse
  extends PaginatedResponse<Settlement> {}

export interface CreateSettlementResponse extends ApiResponse<Settlement> {}

export interface ConfirmSettlementResponse extends ApiResponse<Settlement> {}

/**
 * Statistics API Types
 */
export interface StatisticsOverview {
  totalExpenses: number;
  totalMembers: number;
  averageExpensePerPerson: number;
  expenseByCategory: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  expenseByMember: Array<{
    userId: string;
    user: User;
    amount: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    amount: number;
  }>;
}

export interface StatisticsOverviewResponse
  extends ApiResponse<StatisticsOverview> {}

/**
 * Notification API Types
 */
export interface Notification {
  id: string;
  userId: string;
  type:
    | "group_invite"
    | "expense_added"
    | "settlement_created"
    | "payment_reminder"
    | "system";
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  groupInvites: boolean;
  expenseUpdates: boolean;
  paymentReminders: boolean;
  systemUpdates: boolean;
}

export interface NotificationsListResponse
  extends PaginatedResponse<Notification> {}

export interface NotificationSettingsResponse
  extends ApiResponse<NotificationSettings> {}

export interface UpdateNotificationSettingsRequest {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  groupInvites?: boolean;
  expenseUpdates?: boolean;
  paymentReminders?: boolean;
  systemUpdates?: boolean;
}

export interface UpdateNotificationSettingsResponse
  extends ApiResponse<NotificationSettings> {}

/**
 * Common API Error Codes
 */
export enum ApiErrorCode {
  // Authentication errors
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOKEN_INVALID = "TOKEN_INVALID",
  EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED",
  ACCOUNT_LOCKED = "ACCOUNT_LOCKED",

  // Validation errors
  VALIDATION_ERROR = "VALIDATION_ERROR",
  REQUIRED_FIELD = "REQUIRED_FIELD",
  INVALID_FORMAT = "INVALID_FORMAT",
  PASSWORD_TOO_WEAK = "PASSWORD_TOO_WEAK",

  // Resource errors
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  RESOURCE_ALREADY_EXISTS = "RESOURCE_ALREADY_EXISTS",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  RESOURCE_CONFLICT = "RESOURCE_CONFLICT",

  // Server errors
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",

  // Network errors
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  CONNECTION_ERROR = "CONNECTION_ERROR",
}
