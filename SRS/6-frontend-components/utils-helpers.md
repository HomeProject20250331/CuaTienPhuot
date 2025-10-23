# Utils & Helpers

## API Client

### Base API Client (`apiClient`)

```typescript
// lib/api-client.ts
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("accessToken");

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try to refresh
          await this.refreshToken();
          // Retry the original request
          return this.request(endpoint, options);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: "POST",
        headers: this.defaultHeaders,
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    } catch (error) {
      // Clear tokens and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/auth/login";
      throw error;
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return this.request<T>(url.pathname + url.search);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }

  // File upload
  async uploadFile<T>(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("accessToken");

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error("Invalid JSON response"));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.open("POST", `${this.baseURL}${endpoint}`);
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  }
}

// Create API client instance
export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
);
```

**Features:**

- Automatic token management
- Token refresh handling
- Error handling
- File upload with progress
- Type-safe requests

### API Services

```typescript
// lib/api-services.ts
export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<AuthResponse>("/auth/login", credentials),

  register: (userData: RegisterData) =>
    apiClient.post<AuthResponse>("/auth/register", userData),

  logout: () => apiClient.post("/auth/logout"),

  refreshToken: (data: RefreshTokenData) =>
    apiClient.post<TokenResponse>("/auth/refresh-token", data),

  forgotPassword: (data: ForgotPasswordData) =>
    apiClient.post("/auth/forgot-password", data),

  resetPassword: (data: ResetPasswordData) =>
    apiClient.post("/auth/reset-password", data),

  getMe: () => apiClient.get<User>("/users/me"),
};

export const userApi = {
  updateProfile: (data: UpdateUserData) =>
    apiClient.put<User>("/users/me", data),

  changePassword: (data: ChangePasswordData) =>
    apiClient.put("/users/me/password", data),

  updateAvatar: (file: File) =>
    apiClient.uploadFile<User>("/users/me/avatar", file),

  deleteAvatar: () => apiClient.delete<User>("/users/me/avatar"),
};

export const groupApi = {
  getGroups: (params?: GroupQueryParams) =>
    apiClient.get<PaginatedResponse<Group>>("/groups", params),

  getGroup: (id: string) => apiClient.get<Group>(`/groups/${id}`),

  createGroup: (data: CreateGroupData) =>
    apiClient.post<Group>("/groups", data),

  updateGroup: (id: string, data: UpdateGroupData) =>
    apiClient.put<Group>(`/groups/${id}`, data),

  deleteGroup: (id: string) => apiClient.delete(`/groups/${id}`),

  getGroupMembers: (id: string) =>
    apiClient.get<GroupMember[]>(`/groups/${id}/members`),

  addMember: (id: string, data: AddMemberData) =>
    apiClient.post(`/groups/${id}/members`, data),

  removeMember: (id: string, userId: string) =>
    apiClient.delete(`/groups/${id}/members/${userId}`),

  generateInviteLink: (id: string) =>
    apiClient.post<{ inviteLink: string }>(`/groups/${id}/invite-link`),

  joinGroup: (data: JoinGroupData) =>
    apiClient.post<Group>("/groups/join", data),

  leaveGroup: (id: string) => apiClient.post(`/groups/${id}/leave`),
};

export const expenseApi = {
  getExpenses: (groupId: string, params?: ExpenseQueryParams) =>
    apiClient.get<PaginatedResponse<Expense>>(
      `/groups/${groupId}/expenses`,
      params
    ),

  getExpense: (id: string) => apiClient.get<Expense>(`/expenses/${id}`),

  createExpense: (groupId: string, data: CreateExpenseData) =>
    apiClient.post<Expense>(`/groups/${groupId}/expenses`, data),

  updateExpense: (id: string, data: UpdateExpenseData) =>
    apiClient.put<Expense>(`/expenses/${id}`, data),

  deleteExpense: (id: string) => apiClient.delete(`/expenses/${id}`),

  uploadReceipt: (id: string, file: File) =>
    apiClient.uploadFile(`/expenses/${id}/upload-receipt`, file),

  deleteReceipt: (id: string) => apiClient.delete(`/expenses/${id}/receipt`),
};

export const settlementApi = {
  getBalances: (groupId: string) =>
    apiClient.get<BalancesResponse>(`/groups/${groupId}/balances`),

  getSettlements: (groupId: string, params?: SettlementQueryParams) =>
    apiClient.get<PaginatedResponse<Settlement>>(
      `/groups/${groupId}/settlements`,
      params
    ),

  createSettlement: (groupId: string, data: CreateSettlementData) =>
    apiClient.post<Settlement>(`/groups/${groupId}/settlements`, data),

  markAsPaid: (id: string) => apiClient.put(`/settlements/${id}/mark-paid`),

  cancelSettlement: (id: string) => apiClient.put(`/settlements/${id}/cancel`),

  optimizeBalances: (groupId: string) =>
    apiClient.post<Balance[]>(`/groups/${groupId}/optimize-balances`),
};

export const statisticsApi = {
  getSummary: (groupId: string, period?: StatisticsPeriod) =>
    apiClient.get<StatisticsSummary>(`/groups/${groupId}/stats/summary`, {
      period,
    }),

  getByCategory: (groupId: string, period?: StatisticsPeriod) =>
    apiClient.get<CategoryStatistics[]>(
      `/groups/${groupId}/stats/by-category`,
      { period }
    ),

  getByMember: (groupId: string, period?: StatisticsPeriod) =>
    apiClient.get<MemberStatistics[]>(`/groups/${groupId}/stats/by-member`, {
      period,
    }),

  getByTime: (groupId: string, period?: StatisticsPeriod) =>
    apiClient.get<TimeStatistics[]>(`/groups/${groupId}/stats/by-time`, {
      period,
    }),

  exportReport: (
    groupId: string,
    format: ExportFormat,
    period?: StatisticsPeriod
  ) =>
    apiClient.post<{ exportId: string }>(`/groups/${groupId}/export`, {
      format,
      period,
    }),
};

export const notificationApi = {
  getNotifications: (params?: NotificationQueryParams) =>
    apiClient.get<NotificationResponse>("/notifications", params),

  markAsRead: (id: string) => apiClient.put(`/notifications/${id}/read`),

  markAllAsRead: () => apiClient.put("/notifications/read-all"),

  deleteNotification: (id: string) => apiClient.delete(`/notifications/${id}`),

  deleteAllNotifications: () => apiClient.delete("/notifications"),

  updatePreferences: (preferences: NotificationPreferences) =>
    apiClient.put("/notifications/preferences", preferences),
};
```

**Features:**

- Type-safe API calls
- Consistent error handling
- File upload support
- Query parameter handling

## Formatters

### Currency Formatter (`formatCurrency`)

```typescript
// lib/formatters/currency.ts
interface CurrencyFormatterOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export function formatCurrency(
  amount: number,
  options: CurrencyFormatterOptions = {}
): string {
  const {
    currency = "VND",
    locale = "vi-VN",
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}

// Usage examples
formatCurrency(1000000); // "1.000.000 ₫"
formatCurrency(1000000, { currency: "USD" }); // "$1,000,000.00"
formatCurrency(1000000, { currency: "EUR", locale: "en-US" }); // "€1,000,000.00"
```

**Features:**

- Multi-currency support
- Locale-specific formatting
- Configurable decimal places
- Internationalization

### Date Formatter (`formatDate`)

```typescript
// lib/formatters/date.ts
interface DateFormatterOptions {
  format?: "short" | "medium" | "long" | "full" | "custom";
  customFormat?: string;
  locale?: string;
  timeZone?: string;
}

export function formatDate(
  date: Date | string,
  options: DateFormatterOptions = {}
): string {
  const {
    format = "medium",
    customFormat,
    locale = "vi-VN",
    timeZone = "Asia/Ho_Chi_Minh",
  } = options;

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (customFormat) {
    return formatDateCustom(dateObj, customFormat);
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone,
  };

  switch (format) {
    case "short":
      formatOptions.dateStyle = "short";
      break;
    case "medium":
      formatOptions.dateStyle = "medium";
      break;
    case "long":
      formatOptions.dateStyle = "long";
      break;
    case "full":
      formatOptions.dateStyle = "full";
      break;
  }

  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
}

function formatDateCustom(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return format
    .replace("YYYY", String(year))
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
}

// Usage examples
formatDate(new Date()); // "15/12/2024"
formatDate(new Date(), { format: "long" }); // "15 tháng 12, 2024"
formatDate(new Date(), { customFormat: "DD/MM/YYYY HH:mm" }); // "15/12/2024 14:30"
```

**Features:**

- Multiple format options
- Custom format support
- Locale-specific formatting
- Timezone handling

### Relative Time Formatter (`formatRelativeTime`)

```typescript
// lib/formatters/relative-time.ts
interface RelativeTimeOptions {
  locale?: string;
  numeric?: "always" | "auto";
}

export function formatRelativeTime(
  date: Date | string,
  options: RelativeTimeOptions = {}
): string {
  const { locale = "vi-VN", numeric = "auto" } = options;
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Vừa xong";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} tuần trước`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} năm trước`;
}

// Usage examples
formatRelativeTime(new Date(Date.now() - 5 * 60 * 1000)); // "5 phút trước"
formatRelativeTime(new Date(Date.now() - 2 * 60 * 60 * 1000)); // "2 giờ trước"
formatRelativeTime(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)); // "3 ngày trước"
```

**Features:**

- Human-readable relative time
- Vietnamese localization
- Automatic unit selection
- Configurable options

### File Size Formatter (`formatFileSize`)

```typescript
// lib/formatters/file-size.ts
interface FileSizeOptions {
  locale?: string;
  precision?: number;
}

export function formatFileSize(
  bytes: number,
  options: FileSizeOptions = {}
): string {
  const { locale = "vi-VN", precision = 1 } = options;

  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const size = bytes / Math.pow(k, i);
  return `${size.toFixed(precision)} ${sizes[i]}`;
}

// Usage examples
formatFileSize(1024); // "1.0 KB"
formatFileSize(1048576); // "1.0 MB"
formatFileSize(1073741824); // "1.0 GB"
```

**Features:**

- Automatic unit conversion
- Configurable precision
- Locale support
- Binary units (1024-based)

## Validators

### Form Validators (`validators`)

```typescript
// lib/validators/form-validators.ts
import { z } from "zod";

// Common validation schemas
export const emailSchema = z
  .string()
  .min(1, "Email là bắt buộc")
  .email("Email không hợp lệ");

export const passwordSchema = z
  .string()
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số"
  );

export const phoneSchema = z
  .string()
  .regex(/^(\+84|84|0)[1-9][0-9]{8,9}$/, "Số điện thoại không hợp lệ");

export const nameSchema = z
  .string()
  .min(2, "Tên phải có ít nhất 2 ký tự")
  .max(50, "Tên không được quá 50 ký tự")
  .regex(
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠưăâêôơ\s]+$/,
    "Tên chỉ được chứa chữ cái và khoảng trắng"
  );

// Auth validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
});

export const registerSchema = z
  .object({
    fullName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token là bắt buộc"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// User validation schemas
export const updateProfileSchema = z.object({
  fullName: nameSchema.optional(),
  phone: phoneSchema.optional(),
  dateOfBirth: z.date().optional(),
  address: z.string().max(200, "Địa chỉ không được quá 200 ký tự").optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mật khẩu hiện tại là bắt buộc"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// Group validation schemas
export const createGroupSchema = z.object({
  name: z
    .string()
    .min(2, "Tên nhóm phải có ít nhất 2 ký tự")
    .max(100, "Tên nhóm không được quá 100 ký tự"),
  description: z.string().max(500, "Mô tả không được quá 500 ký tự").optional(),
  currency: z
    .string()
    .min(3, "Đơn vị tiền tệ không hợp lệ")
    .max(3, "Đơn vị tiền tệ không hợp lệ"),
  settings: z.object({
    allowMemberAddExpense: z.boolean(),
    requireApprovalForExpense: z.boolean(),
    autoCalculateBalances: z.boolean(),
    paymentFormula: z.string(),
  }),
});

export const updateGroupSchema = createGroupSchema.partial();

// Expense validation schemas
export const createExpenseSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề là bắt buộc")
    .max(200, "Tiêu đề không được quá 200 ký tự"),
  description: z
    .string()
    .max(1000, "Mô tả không được quá 1000 ký tự")
    .optional(),
  amount: z.number().min(0.01, "Số tiền phải lớn hơn 0"),
  category: z.string().min(1, "Danh mục là bắt buộc"),
  paidBy: z.string().min(1, "Người trả tiền là bắt buộc"),
  participants: z
    .array(
      z.object({
        userId: z.string().min(1, "User ID là bắt buộc"),
        amount: z.number().min(0, "Số tiền phải lớn hơn hoặc bằng 0"),
      })
    )
    .min(1, "Phải có ít nhất 1 người tham gia"),
  expenseDate: z.date(),
  location: z.string().max(200, "Địa điểm không được quá 200 ký tự").optional(),
  tags: z.array(z.string()).optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

// Settlement validation schemas
export const createSettlementSchema = z.object({
  debtorId: z.string().min(1, "Người nợ là bắt buộc"),
  creditorId: z.string().min(1, "Người cho vay là bắt buộc"),
  amount: z.number().min(0.01, "Số tiền phải lớn hơn 0"),
  description: z.string().max(500, "Mô tả không được quá 500 ký tự").optional(),
  paymentMethod: z.string().min(1, "Phương thức thanh toán là bắt buộc"),
  paymentDate: z.date(),
  reference: z
    .string()
    .max(100, "Số tham chiếu không được quá 100 ký tự")
    .optional(),
});

// Notification validation schemas
export const notificationPreferencesSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  expenseNotifications: z.boolean(),
  settlementNotifications: z.boolean(),
  groupNotifications: z.boolean(),
  weeklySummary: z.boolean(),
  monthlyReport: z.boolean(),
});
```

**Features:**

- Comprehensive validation rules
- Vietnamese error messages
- Type-safe schemas
- Custom validation logic
- Refinement validation

### Custom Validators (`customValidators`)

```typescript
// lib/validators/custom-validators.ts
export const customValidators = {
  // Vietnamese phone number validation
  vietnamesePhone: (value: string): boolean => {
    const phoneRegex = /^(\+84|84|0)[1-9][0-9]{8,9}$/;
    return phoneRegex.test(value);
  },

  // Vietnamese name validation
  vietnameseName: (value: string): boolean => {
    const nameRegex =
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠưăâêôơ\s]+$/;
    return nameRegex.test(value) && value.trim().length >= 2;
  },

  // Strong password validation
  strongPassword: (value: string): boolean => {
    const hasLowerCase = /[a-z]/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasMinLength = value.length >= 8;

    return (
      hasLowerCase &&
      hasUpperCase &&
      hasNumbers &&
      hasSpecialChar &&
      hasMinLength
    );
  },

  // File size validation
  fileSize: (file: File, maxSizeInMB: number): boolean => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  },

  // File type validation
  fileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type);
  },

  // Image file validation
  imageFile: (file: File): boolean => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    return customValidators.fileType(file, allowedTypes);
  },

  // Document file validation
  documentFile: (file: File): boolean => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    return customValidators.fileType(file, allowedTypes);
  },

  // URL validation
  validUrl: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  // Date range validation
  dateRange: (startDate: Date, endDate: Date): boolean => {
    return startDate <= endDate;
  },

  // Age validation
  validAge: (birthDate: Date, minAge: number = 18): boolean => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1 >= minAge;
    }

    return age >= minAge;
  },

  // Currency amount validation
  validAmount: (
    amount: number,
    minAmount: number = 0,
    maxAmount?: number
  ): boolean => {
    if (amount < minAmount) return false;
    if (maxAmount && amount > maxAmount) return false;
    return true;
  },

  // Percentage validation
  validPercentage: (value: number): boolean => {
    return value >= 0 && value <= 100;
  },

  // Vietnamese ID card validation
  vietnameseIdCard: (value: string): boolean => {
    const idRegex = /^[0-9]{9}$|^[0-9]{12}$/;
    return idRegex.test(value);
  },
};
```

**Features:**

- Vietnamese-specific validations
- File validation
- Date and age validation
- Currency validation
- Custom business rules

## Constants

### App Constants (`constants`)

```typescript
// lib/constants/app-constants.ts
export const APP_CONFIG = {
  name: "CuaTienPhuot",
  version: "1.0.0",
  description: "Ứng dụng chia tiền du lịch thông minh",
  author: "CuaTienPhuot Team",
  website: "https://cuatienphuot.com",
  supportEmail: "support@cuatienphuot.com",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001",
  uploadUrl:
    process.env.NEXT_PUBLIC_UPLOAD_URL || "http://localhost:3001/uploads",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  DASHBOARD: "/dashboard",
  GROUPS: "/groups",
  GROUP_DETAIL: (id: string) => `/groups/${id}`,
  GROUP_EXPENSES: (id: string) => `/groups/${id}/expenses`,
  GROUP_BALANCES: (id: string) => `/groups/${id}/balances`,
  GROUP_STATS: (id: string) => `/groups/${id}/stats`,
  GROUP_SETTINGS: (id: string) => `/groups/${id}/settings`,
  PROFILE: "/profile",
  NOTIFICATIONS: "/notifications",
  SETTINGS: "/settings",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  USERS: {
    ME: "/users/me",
    UPDATE_PROFILE: "/users/me",
    CHANGE_PASSWORD: "/users/me/password",
    UPDATE_AVATAR: "/users/me/avatar",
  },
  GROUPS: {
    LIST: "/groups",
    DETAIL: (id: string) => `/groups/${id}`,
    MEMBERS: (id: string) => `/groups/${id}/members`,
    INVITE_LINK: (id: string) => `/groups/${id}/invite-link`,
    JOIN: "/groups/join",
    LEAVE: (id: string) => `/groups/${id}/leave`,
  },
  EXPENSES: {
    LIST: (groupId: string) => `/groups/${groupId}/expenses`,
    DETAIL: (id: string) => `/expenses/${id}`,
    UPLOAD_RECEIPT: (id: string) => `/expenses/${id}/upload-receipt`,
  },
  SETTLEMENTS: {
    BALANCES: (groupId: string) => `/groups/${groupId}/balances`,
    LIST: (groupId: string) => `/groups/${groupId}/settlements`,
    MARK_PAID: (id: string) => `/settlements/${id}/mark-paid`,
    CANCEL: (id: string) => `/settlements/${id}/cancel`,
    OPTIMIZE: (groupId: string) => `/groups/${groupId}/optimize-balances`,
  },
  STATISTICS: {
    SUMMARY: (groupId: string) => `/groups/${groupId}/stats/summary`,
    BY_CATEGORY: (groupId: string) => `/groups/${groupId}/stats/by-category`,
    BY_MEMBER: (groupId: string) => `/groups/${groupId}/stats/by-member`,
    BY_TIME: (groupId: string) => `/groups/${groupId}/stats/by-time`,
    EXPORT: (groupId: string) => `/groups/${groupId}/export`,
  },
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
    DELETE: (id: string) => `/notifications/${id}`,
    DELETE_ALL: "/notifications",
    PREFERENCES: "/notifications/preferences",
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
} as const;

export const CURRENCIES = [
  { code: "VND", name: "Việt Nam Đồng", symbol: "₫" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
] as const;

export const EXPENSE_CATEGORIES = [
  { value: "food", label: "Ăn uống", icon: "🍽️" },
  { value: "transport", label: "Di chuyển", icon: "🚗" },
  { value: "accommodation", label: "Lưu trú", icon: "🏨" },
  { value: "entertainment", label: "Giải trí", icon: "🎭" },
  { value: "shopping", label: "Mua sắm", icon: "🛍️" },
  { value: "health", label: "Y tế", icon: "🏥" },
  { value: "communication", label: "Liên lạc", icon: "📱" },
  { value: "other", label: "Khác", icon: "📝" },
] as const;

export const PAYMENT_METHODS = [
  { value: "cash", label: "Tiền mặt", icon: "💵" },
  { value: "bank_transfer", label: "Chuyển khoản", icon: "🏦" },
  { value: "momo", label: "MoMo", icon: "📱" },
  { value: "zalopay", label: "ZaloPay", icon: "💳" },
  { value: "vnpay", label: "VNPay", icon: "💳" },
  { value: "other", label: "Khác", icon: "💳" },
] as const;

export const NOTIFICATION_TYPES = [
  { value: "expense", label: "Chi tiêu", icon: "💰" },
  { value: "settlement", label: "Thanh toán", icon: "💸" },
  { value: "group", label: "Nhóm", icon: "👥" },
  { value: "system", label: "Hệ thống", icon: "⚙️" },
] as const;

export const STATISTICS_PERIODS = [
  { value: "week", label: "Tuần" },
  { value: "month", label: "Tháng" },
  { value: "quarter", label: "Quý" },
  { value: "year", label: "Năm" },
  { value: "all", label: "Tất cả" },
] as const;

export const EXPORT_FORMATS = [
  { value: "pdf", label: "PDF", icon: "📄" },
  { value: "excel", label: "Excel", icon: "📊" },
  { value: "csv", label: "CSV", icon: "📋" },
] as const;
```

**Features:**

- Centralized configuration
- Type-safe constants
- Environment-specific values
- Reusable constants
- Comprehensive options

## Utility Functions

### Helper Functions (`helpers`)

```typescript
// lib/helpers/general-helpers.ts
export const helpers = {
  // Generate unique ID
  generateId: (): string => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  },

  // Generate random string
  generateRandomString: (length: number = 8): string => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Generate invite code
  generateInviteCode: (): string => {
    return helpers.generateRandomString(8).toUpperCase();
  },

  // Debounce function
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Deep clone object
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as any;
    if (obj instanceof Array)
      return obj.map((item) => helpers.deepClone(item)) as any;
    if (typeof obj === "object") {
      const clonedObj = {} as any;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = helpers.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
    return obj;
  },

  // Check if object is empty
  isEmpty: (obj: any): boolean => {
    if (obj == null) return true;
    if (typeof obj === "string" || Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === "object") return Object.keys(obj).length === 0;
    return false;
  },

  // Get nested object value safely
  getNestedValue: (obj: any, path: string, defaultValue?: any): any => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined
        ? current[key]
        : defaultValue;
    }, obj);
  },

  // Capitalize first letter
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Convert to slug
  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  },

  // Truncate text
  truncate: (str: string, length: number, suffix: string = "..."): string => {
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
  },

  // Format phone number
  formatPhoneNumber: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
    }
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
    }
    return phone;
  },

  // Validate email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate Vietnamese phone
  isValidVietnamesePhone: (phone: string): boolean => {
    const phoneRegex = /^(\+84|84|0)[1-9][0-9]{8,9}$/;
    return phoneRegex.test(phone);
  },

  // Get file extension
  getFileExtension: (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "";
  },

  // Check if file is image
  isImageFile: (filename: string): boolean => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
    const extension = helpers.getFileExtension(filename);
    return imageExtensions.includes(extension);
  },

  // Check if file is document
  isDocumentFile: (filename: string): boolean => {
    const documentExtensions = ["pdf", "doc", "docx", "txt", "rtf"];
    const extension = helpers.getFileExtension(filename);
    return documentExtensions.includes(extension);
  },

  // Get file size in human readable format
  getFileSize: (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  // Calculate age from birth date
  calculateAge: (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  },

  // Get time ago string
  getTimeAgo: (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)} tháng trước`;
    return `${Math.floor(diffInSeconds / 31536000)} năm trước`;
  },

  // Sort array by key
  sortBy: <T>(
    array: T[],
    key: keyof T,
    direction: "asc" | "desc" = "asc"
  ): T[] => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  },

  // Group array by key
  groupBy: <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  // Remove duplicates from array
  unique: <T>(array: T[]): T[] => {
    return [...new Set(array)];
  },

  // Shuffle array
  shuffle: <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  // Get random item from array
  randomItem: <T>(array: T[]): T | undefined => {
    return array[Math.floor(Math.random() * array.length)];
  },

  // Get random items from array
  randomItems: <T>(array: T[], count: number): T[] => {
    const shuffled = helpers.shuffle(array);
    return shuffled.slice(0, count);
  },
};
```

**Features:**

- Comprehensive utility functions
- Vietnamese-specific helpers
- File handling utilities
- Date and time utilities
- Array manipulation
- String manipulation
- Validation helpers
