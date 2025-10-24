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
  data?: T;
  message?: string;
  timestamp: string;
  error?: {
    code: string;
    message: string;
    details?: string;
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
  hasNext: boolean;
  hasPrev: boolean;
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
  _id: string;
  name: string;
  description: string;
  currency: string;
  memberCount: number;
  totalExpenses: number;
  status: "active" | "completed" | "archived";
  createdBy: any;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
  members: GroupMember[];
  settings: GroupSettings;
}

export interface GroupMember {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  avatar?: string;
  role: "admin" | "member";
  joinedAt: string;
  isActive: boolean;
  totalExpenses?: number;
  balance?: number;
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
  expenseDate: string;
  paidBy: {
    id: string;
    fullName: string;
    avatar?: string;
    email?: string;
  };
  participants: ExpenseParticipant[];
  tags?: string[];
  receipt?: {
    url: string;
    thumbnail?: string;
    uploadedAt: string;
    fileSize?: number;
    mimeType?: string;
  };
  status: "active" | "cancelled";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  group?: {
    id: string;
    name: string;
    currency: string;
  };
}

export interface ExpenseParticipant {
  userId: string;
  user: {
    id: string;
    fullName: string;
    avatar?: string;
    email?: string;
  };
  amount: number;
  share: number;
  isPaid?: boolean;
  paidAt?: string;
}

export interface CreateExpenseRequest {
  title: string;
  description?: string;
  amount: number;
  currency: string;
  category: string;
  paidBy: string;
  participants: {
    userId: string;
    amount: number;
  }[];
  expenseDate?: string;
  location?: string;
  tags?: string[];
}

export interface UpdateExpenseRequest {
  title?: string;
  description?: string;
  amount?: number;
  category?: string;
  participants?: {
    userId: string;
    amount: number;
  }[];
  expenseDate?: string;
  location?: string;
  tags?: string[];
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
  debtor: {
    id: string;
    fullName: string;
    avatar?: string;
    email?: string;
    phone?: string;
  };
  creditor: {
    id: string;
    fullName: string;
    avatar?: string;
    email?: string;
    phone?: string;
  };
  amount: number;
  currency: string;
  description?: string;
  paymentMethod: "cash" | "bank_transfer" | "momo" | "zalopay" | "other";
  paymentDate: string;
  reference?: string;
  status: "pending" | "completed" | "cancelled";
  completedAt?: string;
  completedBy?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  reason?: string;
  note?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  group?: {
    id: string;
    name: string;
    currency: string;
  };
}

export interface CreateSettlementRequest {
  debtorId: string;
  creditorId: string;
  amount: number;
  description?: string;
  paymentMethod: "cash" | "bank_transfer" | "momo" | "zalopay" | "other";
  paymentDate?: string;
  reference?: string;
}

export interface ConfirmSettlementRequest {
  completedAt?: string;
  note?: string;
}

export interface CancelSettlementRequest {
  reason?: string;
}

export interface SettlementsListResponse
  extends PaginatedResponse<Settlement> {}

export interface CreateSettlementResponse extends ApiResponse<Settlement> {}

export interface ConfirmSettlementResponse extends ApiResponse<Settlement> {}

/**
 * Statistics API Types
 */
export interface StatisticsOverview {
  group: {
    id: string;
    name: string;
    currency: string;
    memberCount: number;
  };
  period: {
    from: string;
    to: string;
  };
  overview: {
    totalExpenses: number;
    totalSettlements: number;
    pendingAmount: number;
    expenseCount: number;
    settlementCount: number;
    averageExpense: number;
    largestExpense: number;
    smallestExpense: number;
  };
  trends: {
    expensesGrowth: number;
    settlementsGrowth: number;
    activeMembers: number;
    newMembers: number;
  };
  topSpenders: Array<{
    userId: string;
    fullName: string;
    avatar?: string;
    totalSpent: number;
    expenseCount: number;
    averageExpense: number;
  }>;
  recentActivity: Array<{
    type: "expense" | "settlement" | "group";
    title: string;
    amount?: number;
    user: string;
    createdAt: string;
  }>;
}

export interface StatisticsOverviewResponse
  extends ApiResponse<StatisticsOverview> {}

/**
 * Notification API Types
 */
export interface Notification {
  id: string;
  type: "expense" | "settlement" | "group" | "system";
  title: string;
  message: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  isRead: boolean;
  data?: any;
  actions?: Array<{
    label: string;
    action: string;
    url: string;
  }>;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
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
