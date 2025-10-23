# Pages Structure - Next.js App Router

## Public Pages

### Landing Page (`/`)

```typescript
// app/page.tsx
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
```

**Components:**

- `HeroSection`: Hero banner với CTA
- `FeaturesSection`: Tính năng chính
- `PricingSection`: Bảng giá (nếu có)
- `TestimonialsSection`: Đánh giá người dùng

### Authentication Pages

#### Login Page (`/auth/login`)

```typescript
// app/(auth)/login/page.tsx
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <LoginForm />
        <AuthLinks />
      </div>
    </div>
  );
}
```

**Components:**

- `LoginForm`: Form đăng nhập với validation
- `AuthLinks`: Links đến register/forgot password
- `SocialLogin`: Đăng nhập qua Google/Facebook (tương lai)

#### Register Page (`/auth/register`)

```typescript
// app/(auth)/register/page.tsx
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <RegisterForm />
        <AuthLinks />
      </div>
    </div>
  );
}
```

**Components:**

- `RegisterForm`: Form đăng ký với validation
- `AuthLinks`: Links đến login
- `TermsAndConditions`: Điều khoản sử dụng

#### Forgot Password Page (`/auth/forgot-password`)

```typescript
// app/(auth)/forgot-password/page.tsx
export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <ForgotPasswordForm />
        <AuthLinks />
      </div>
    </div>
  );
}
```

**Components:**

- `ForgotPasswordForm`: Form quên mật khẩu
- `AuthLinks`: Links về login

#### Reset Password Page (`/auth/reset-password`)

```typescript
// app/(auth)/reset-password/page.tsx
export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <ResetPasswordForm token={searchParams.token} />
        <AuthLinks />
      </div>
    </div>
  );
}
```

**Components:**

- `ResetPasswordForm`: Form đặt lại mật khẩu
- `AuthLinks`: Links về login

## Protected Pages (Dashboard)

### Dashboard Layout

```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
```

### Main Dashboard (`/dashboard`)

```typescript
// app/(dashboard)/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <StatsOverview />
      <RecentActivity />
      <QuickActions />
    </div>
  );
}
```

**Components:**

- `DashboardHeader`: Welcome message và quick stats
- `StatsOverview`: Tổng quan thống kê
- `RecentActivity`: Hoạt động gần đây
- `QuickActions`: Các hành động nhanh

### Groups Pages

#### Groups List (`/groups`)

```typescript
// app/(dashboard)/groups/page.tsx
export default function GroupsPage() {
  return (
    <div className="space-y-6">
      <GroupsHeader />
      <GroupsFilters />
      <GroupsList />
      <CreateGroupButton />
    </div>
  );
}
```

**Components:**

- `GroupsHeader`: Header với search và filter
- `GroupsFilters`: Filter theo status, date, etc.
- `GroupsList`: Danh sách nhóm với pagination
- `CreateGroupButton`: Button tạo nhóm mới

#### Group Detail (`/groups/[id]`)

```typescript
// app/(dashboard)/groups/[id]/page.tsx
export default function GroupDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <GroupHeader groupId={params.id} />
      <GroupTabs groupId={params.id} />
      <GroupContent groupId={params.id} />
    </div>
  );
}
```

**Components:**

- `GroupHeader`: Header với thông tin nhóm
- `GroupTabs`: Tab navigation (expenses, balances, stats, settings)
- `GroupContent`: Content của tab hiện tại

#### Group Expenses (`/groups/[id]/expenses`)

```typescript
// app/(dashboard)/groups/[id]/expenses/page.tsx
export default function GroupExpensesPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <ExpensesHeader groupId={params.id} />
      <ExpensesFilters />
      <ExpensesList groupId={params.id} />
      <AddExpenseButton groupId={params.id} />
    </div>
  );
}
```

**Components:**

- `ExpensesHeader`: Header với stats
- `ExpensesFilters`: Filter theo category, date, member
- `ExpensesList`: Danh sách chi tiêu
- `AddExpenseButton`: Button thêm chi tiêu

#### Group Balances (`/groups/[id]/balances`)

```typescript
// app/(dashboard)/groups/[id]/balances/page.tsx
export default function GroupBalancesPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <BalancesHeader groupId={params.id} />
      <BalancesSummary />
      <BalancesTable groupId={params.id} />
      <SettleDebtButton groupId={params.id} />
    </div>
  );
}
```

**Components:**

- `BalancesHeader`: Header với tổng quan
- `BalancesSummary`: Tổng quan công nợ
- `BalancesTable`: Bảng công nợ chi tiết
- `SettleDebtButton`: Button thanh toán

#### Group Statistics (`/groups/[id]/stats`)

```typescript
// app/(dashboard)/groups/[id]/stats/page.tsx
export default function GroupStatsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <StatsHeader groupId={params.id} />
      <StatsOverview groupId={params.id} />
      <StatsCharts groupId={params.id} />
      <ExportButton groupId={params.id} />
    </div>
  );
}
```

**Components:**

- `StatsHeader`: Header với period selector
- `StatsOverview`: Tổng quan thống kê
- `StatsCharts`: Biểu đồ thống kê
- `ExportButton`: Button export báo cáo

#### Group Settings (`/groups/[id]/settings`)

```typescript
// app/(dashboard)/groups/[id]/settings/page.tsx
export default function GroupSettingsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <SettingsHeader groupId={params.id} />
      <GroupSettingsForm groupId={params.id} />
      <MemberManagement groupId={params.id} />
      <DangerZone groupId={params.id} />
    </div>
  );
}
```

**Components:**

- `SettingsHeader`: Header với navigation
- `GroupSettingsForm`: Form cài đặt nhóm
- `MemberManagement`: Quản lý thành viên
- `DangerZone`: Các hành động nguy hiểm

### User Pages

#### Profile Page (`/profile`)

```typescript
// app/(dashboard)/profile/page.tsx
export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <ProfileHeader />
      <ProfileForm />
      <PasswordForm />
      <AvatarUpload />
      <NotificationSettings />
    </div>
  );
}
```

**Components:**

- `ProfileHeader`: Header với avatar và basic info
- `ProfileForm`: Form thông tin cá nhân
- `PasswordForm`: Form đổi mật khẩu
- `AvatarUpload`: Upload avatar
- `NotificationSettings`: Cài đặt thông báo

#### Notifications Page (`/notifications`)

```typescript
// app/(dashboard)/notifications/page.tsx
export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <NotificationsHeader />
      <NotificationsFilters />
      <NotificationsList />
      <NotificationSettings />
    </div>
  );
}
```

**Components:**

- `NotificationsHeader`: Header với unread count
- `NotificationsFilters`: Filter theo type, date
- `NotificationsList`: Danh sách thông báo
- `NotificationSettings`: Cài đặt thông báo

#### App Settings (`/settings`)

```typescript
// app/(dashboard)/settings/page.tsx
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SettingsHeader />
      <GeneralSettings />
      <PrivacySettings />
      <NotificationSettings />
      <AccountSettings />
    </div>
  );
}
```

**Components:**

- `SettingsHeader`: Header với navigation
- `GeneralSettings`: Cài đặt chung
- `PrivacySettings`: Cài đặt riêng tư
- `NotificationSettings`: Cài đặt thông báo
- `AccountSettings`: Cài đặt tài khoản

## Page Components Structure

### Layout Components

- **RootLayout**: Layout gốc với providers
- **AuthLayout**: Layout cho auth pages
- **DashboardLayout**: Layout cho dashboard pages
- **GroupLayout**: Layout cho group pages

### Page-Specific Components

- **LandingPage**: Landing page components
- **AuthPages**: Authentication page components
- **DashboardPages**: Dashboard page components
- **GroupPages**: Group page components
- **UserPages**: User page components

### Shared Components

- **LoadingSpinner**: Loading state
- **ErrorBoundary**: Error handling
- **NotFound**: 404 page
- **Unauthorized**: 403 page
- **ServerError**: 500 page

## Routing Configuration

### Route Groups

- `(auth)`: Authentication routes
- `(dashboard)`: Protected dashboard routes
- `(public)`: Public routes

### Route Protection

- **Middleware**: Authentication check
- **Route Guards**: Permission-based access
- **Redirects**: Automatic redirects based on auth state

### Dynamic Routes

- `[id]`: Dynamic group ID
- `[...slug]`: Catch-all routes
- `(group)`: Route groups for organization

## Page Metadata

### SEO Configuration

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: "CuaTienPhuot - Chia tiền du lịch thông minh",
  description: "Ứng dụng chia tiền chi tiêu nhóm du lịch dễ dàng và chính xác",
  keywords: ["chia tiền", "du lịch", "nhóm", "chi tiêu", "công nợ"],
  authors: [{ name: "CuaTienPhuot Team" }],
  viewport: "width=device-width, initial-scale=1",
};
```

### Page-Specific Metadata

```typescript
// app/(dashboard)/groups/[id]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const group = await getGroup(params.id);

  return {
    title: `${group.name} - CuaTienPhuot`,
    description: `Quản lý chi tiêu nhóm ${group.name}`,
  };
}
```

## Performance Optimization

### Code Splitting

- Route-based splitting
- Component lazy loading
- Dynamic imports

### Caching Strategy

- Static generation for public pages
- ISR for dynamic content
- Client-side caching with React Query

### Bundle Optimization

- Tree shaking
- Dynamic imports
- Image optimization
- Font optimization
