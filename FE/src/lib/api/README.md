# API Services với React Query và Axios

Hệ thống API services đã được cập nhật để sử dụng **@tanstack/react-query** và **axios** theo SRS.

## 🚀 Tính năng mới

- ✅ **React Query Integration**: Quản lý state và cache tự động
- ✅ **Axios Instance**: Cấu hình interceptors cho authentication
- ✅ **Error Boundary**: Xử lý lỗi toàn cục
- ✅ **Retry Logic**: Tự động retry cho failed requests
- ✅ **TypeScript Support**: Full type safety
- ✅ **DevTools**: React Query DevTools cho development

## 📁 Cấu trúc API

```
src/lib/api/
├── query-client.ts          # Cấu hình React Query
├── query-provider.tsx       # Provider component với Error Boundary
├── axios-client.ts          # Axios instance với interceptors
├── error-boundary.tsx       # Error boundary component
├── config.ts                # API configuration
├── examples.tsx             # Ví dụ sử dụng
├── hooks/                   # Custom React Query hooks
│   ├── auth.ts              # Authentication hooks
│   ├── groups.ts            # Groups hooks
│   ├── expenses.ts          # Expenses hooks
│   ├── settlements.ts       # Settlements hooks
│   ├── statistics.ts        # Statistics hooks
│   ├── notifications.ts     # Notifications hooks
│   └── index.ts             # Export tất cả hooks
├── index.ts                 # Export chính
└── README.md                # Hướng dẫn này
```

## 🔧 Cài đặt

### 1. Cài đặt dependencies

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools axios
```

### 2. Cấu hình Provider

Đã được tích hợp vào `src/app/layout.tsx`:

```tsx
import { QueryProvider } from "@/lib/api";

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
```

## 📖 Cách sử dụng

### Authentication Hooks

```tsx
import { useAuth, useLogin, useLogout } from "@/lib/api";

function LoginComponent() {
  const loginMutation = useLogin();
  const { user, isAuthenticated } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      await loginMutation.mutateAsync(credentials);
      // Login thành công, user sẽ được cập nhật tự động
    } catch (error) {
      // Error được xử lý tự động
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Xin chào, {user?.name}!</p>
      ) : (
        <button onClick={() => handleLogin(credentials)}>Đăng nhập</button>
      )}
    </div>
  );
}
```

### Groups Hooks

```tsx
import { useGroups, useGroup, useCreateGroup } from "@/lib/api";

function GroupsComponent() {
  const { data: groups, isLoading } = useGroups({
    page: 1,
    limit: 10,
  });

  const createGroupMutation = useCreateGroup();

  const handleCreateGroup = async (groupData) => {
    try {
      await createGroupMutation.mutateAsync(groupData);
      // Groups list sẽ được cập nhật tự động
    } catch (error) {
      // Error được xử lý tự động
    }
  };

  if (isLoading) return <div>Đang tải...</div>;

  return (
    <div>
      {groups?.data?.map((group) => (
        <div key={group.id}>
          <h3>{group.name}</h3>
          <p>{group.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Expenses Hooks

```tsx
import { useExpenses, useCreateExpense } from "@/lib/api";

function ExpensesComponent({ groupId }) {
  const { data: expenses, isLoading } = useExpenses(groupId, {
    page: 1,
    limit: 20,
  });

  const createExpenseMutation = useCreateExpense();

  const handleCreateExpense = async (expenseData) => {
    try {
      await createExpenseMutation.mutateAsync({
        groupId,
        data: expenseData,
      });
      // Expenses list sẽ được cập nhật tự động
    } catch (error) {
      // Error được xử lý tự động
    }
  };

  return <div>{/* Render expenses */}</div>;
}
```

### Settlements Hooks

```tsx
import { useBalances, useSettlements, useCreateSettlement } from "@/lib/api";

function SettlementsComponent({ groupId }) {
  const { data: balances } = useBalances(groupId);
  const { data: settlements } = useSettlements(groupId);
  const createSettlementMutation = useCreateSettlement();

  const handleCreateSettlement = async (settlementData) => {
    try {
      await createSettlementMutation.mutateAsync({
        groupId,
        data: settlementData,
      });
    } catch (error) {
      // Error được xử lý tự động
    }
  };

  return <div>{/* Render balances and settlements */}</div>;
}
```

### Statistics Hooks

```tsx
import { useStatsSummary, useStatsByCategory } from "@/lib/api";

function StatisticsComponent({ groupId }) {
  const { data: summary } = useStatsSummary(groupId);
  const { data: categoryStats } = useStatsByCategory(groupId);

  return (
    <div>
      <h2>Tổng quan</h2>
      <p>Tổng chi tiêu: {summary?.data?.totalAmount} VNĐ</p>

      <h2>Thống kê theo danh mục</h2>
      {categoryStats?.data?.map((stat) => (
        <div key={stat.categoryId}>
          <p>
            {stat.categoryName}: {stat.totalAmount} VNĐ
          </p>
        </div>
      ))}
    </div>
  );
}
```

### Notifications Hooks

```tsx
import { useNotifications, useUnreadNotificationsCount } from "@/lib/api";

function NotificationsComponent() {
  const { data: notifications } = useNotifications();
  const { data: unreadCount } = useUnreadNotificationsCount();

  return (
    <div>
      <h2>Thông báo ({unreadCount?.data?.count || 0} chưa đọc)</h2>
      {notifications?.data?.map((notification) => (
        <div key={notification.id}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🔄 Cache Management

### Invalidate Queries

```tsx
import { queryUtils } from "@/lib/api";

// Invalidate tất cả auth queries
queryUtils.invalidateAuth();

// Invalidate tất cả group queries
queryUtils.invalidateGroups();

// Invalidate specific group
queryUtils.invalidateGroup(groupId);

// Clear tất cả cache (useful for logout)
queryUtils.clearAll();
```

### Manual Cache Updates

```tsx
import { useQueryClient, queryKeys } from "@/lib/api";

function MyComponent() {
  const queryClient = useQueryClient();

  const updateUserInCache = (userData) => {
    queryClient.setQueryData(queryKeys.auth.me, userData);
  };

  const removeGroupFromCache = (groupId) => {
    queryClient.removeQueries({ queryKey: queryKeys.groups.detail(groupId) });
  };
}
```

## ⚙️ Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Query Client Options

```tsx
// query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 2,
    },
  },
});
```

## 🛠️ Error Handling

### Automatic Error Handling

Tất cả errors được xử lý tự động:

- **Network errors**: Retry với exponential backoff
- **4xx errors**: Không retry, hiển thị error message
- **5xx errors**: Retry tối đa 3 lần
- **401 errors**: Tự động refresh token

### Custom Error Handling

```tsx
const mutation = useCreateGroup();

const handleSubmit = async (data) => {
  try {
    await mutation.mutateAsync(data);
  } catch (error) {
    // Error đã được xử lý tự động
    // Có thể thêm custom logic ở đây
    console.error("Custom error handling:", error);
  }
};
```

## 🎯 Best Practices

### 1. Sử dụng React Query Hooks

```tsx
// ✅ Good
const { data, isLoading, error } = useGroups();

// ❌ Avoid
const [groups, setGroups] = useState([]);
const [loading, setLoading] = useState(false);
```

### 2. Handle Loading States

```tsx
// ✅ Good
if (isLoading) return <LoadingSpinner />;

// ❌ Avoid
if (loading) return <div>Loading...</div>;
```

### 3. Error Boundaries

```tsx
// ✅ Good - Error boundary đã được tích hợp
<QueryProvider>
  <App />
</QueryProvider>

// ❌ Avoid - Không có error handling
<App />
```

### 4. Optimistic Updates

```tsx
const updateGroupMutation = useUpdateGroup();

const handleUpdate = async (data) => {
  // Optimistic update
  queryClient.setQueryData(queryKeys.groups.detail(groupId), (old) => ({
    ...old,
    data: { ...old.data, ...data },
  }));

  try {
    await updateGroupMutation.mutateAsync({ id: groupId, data });
  } catch (error) {
    // Revert on error
    queryClient.invalidateQueries({
      queryKey: queryKeys.groups.detail(groupId),
    });
  }
};
```

## 🔍 Debugging

### React Query DevTools

DevTools đã được tích hợp và chỉ hiển thị trong development mode:

```tsx
// Tự động hiển thị trong development
{
  process.env.NODE_ENV === "development" && (
    <ReactQueryDevtools initialIsOpen={false} />
  );
}
```

### Console Logging

```tsx
// Request/Response logging tự động trong development
console.log("🚀 API Request: POST /auth/login");
console.log("✅ API Response: /auth/login");
console.log("❌ API Error: /auth/login");
```

## 📝 Migration từ Legacy API

### Trước (Legacy)

```tsx
import { authApi } from "@/lib/api/auth";

const handleLogin = async () => {
  setLoading(true);
  try {
    const response = await authApi.login(credentials);
    if (response.success) {
      setUser(response.data.user);
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Sau (React Query)

```tsx
import { useLogin } from "@/lib/api";

const loginMutation = useLogin();

const handleLogin = async () => {
  try {
    await loginMutation.mutateAsync(credentials);
    // User được cập nhật tự động
  } catch (error) {
    // Error được xử lý tự động
  }
};
```

## 🚀 Performance Benefits

- **Automatic Caching**: Giảm số lượng API calls
- **Background Refetching**: Cập nhật data tự động
- **Optimistic Updates**: UI responsive hơn
- **Request Deduplication**: Tránh duplicate requests
- **Error Retry**: Tự động retry failed requests

## 📞 Support

Nếu có vấn đề:

1. Kiểm tra console logs
2. Sử dụng React Query DevTools
3. Kiểm tra network tab
4. Xem error messages

---

**Happy Coding với React Query! 🚀**
