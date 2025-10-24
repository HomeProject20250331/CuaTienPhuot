# Frontend Components Structure - Tổng quan

## Tech Stack

### Core Technologies

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: Shadcn/ui + Radix UI
- **Styling**: TailwindCSS
- **State Management**: Zustand + React Query
- **Form Handling**: React Hook Form + Zod
- **Form Validation**: Zod schemas với @hookform/resolvers/zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Development Tools

- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Storybook**: Component documentation

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Dashboard route group
│   │   ├── dashboard/
│   │   ├── groups/
│   │   ├── groups/[id]/
│   │   └── profile/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # Reusable components
│   ├── ui/                      # Shadcn/ui components (Button, Input, Form, etc.)
│   ├── layout/                  # Layout components
│   ├── forms/                   # Form components với React Hook Form
│   ├── data-display/            # Data display components
│   ├── modals/                  # Modal components
│   └── notifications/           # Notification components
├── hooks/                       # Custom hooks
├── lib/                         # Utilities & helpers
├── store/                       # Zustand stores
├── types/                       # TypeScript types
└── constants/                   # App constants
```

## Routing Structure

### Public Routes

- `/` - Landing page
- `/auth/login` - Đăng nhập
- `/auth/register` - Đăng ký
- `/auth/forgot-password` - Quên mật khẩu
- `/auth/reset-password` - Đặt lại mật khẩu

### Protected Routes (Dashboard)

- `/dashboard` - Dashboard chính
- `/groups` - Danh sách nhóm
- `/groups/[id]` - Chi tiết nhóm
- `/groups/[id]/expenses` - Chi tiêu của nhóm
- `/groups/[id]/balances` - Công nợ
- `/groups/[id]/stats` - Thống kê
- `/groups/[id]/settings` - Cài đặt nhóm
- `/profile` - Profile người dùng
- `/notifications` - Thông báo
- `/settings` - Cài đặt ứng dụng

## Component Architecture

### Component Categories

#### 1. Layout Components

- **Header**: Navigation bar với user menu
- **Sidebar**: Navigation sidebar cho dashboard
- **Footer**: Footer với links và thông tin
- **Navigation**: Breadcrumb và navigation helpers

#### 2. Form Components (React Hook Form + Zod)

- **Input**: Text input với Shadcn/ui styling
- **Select**: Dropdown select với search
- **DatePicker**: Date picker component
- **FileUpload**: File upload với drag & drop
- **FormField**: Shadcn/ui FormField với React Hook Form
- **FormMessage**: Error display component
- **Form**: Form wrapper với validation
- **FormItem**: Form item wrapper
- **FormLabel**: Form label component
- **FormControl**: Form control wrapper

#### 3. Data Display Components

- **Table**: Data table với sorting, filtering, pagination
- **Card**: Content card component
- **Chart**: Chart components (pie, bar, line)
- **Avatar**: User avatar với fallback
- **Badge**: Status badge component
- **Skeleton**: Loading skeleton

#### 4. Modal Components

- **CreateGroup**: Modal tạo nhóm mới
- **AddExpense**: Modal thêm chi tiêu
- **SettleDebt**: Modal thanh toán công nợ
- **ConfirmDialog**: Confirmation dialog
- **ReceiptViewer**: Modal xem hóa đơn

#### 5. Notification Components

- **Toast**: Toast notification
- **NotificationList**: Danh sách thông báo
- **Alert**: Alert component
- **NotificationBadge**: Badge hiển thị số thông báo

## State Management

### Zustand Stores

- **authStore**: Authentication state
- **userStore**: User profile state
- **groupStore**: Groups state
- **expenseStore**: Expenses state
- **notificationStore**: Notifications state
- **uiStore**: UI state (modals, sidebar, etc.)

### React Query

- **useAuth**: Authentication queries
- **useGroups**: Groups queries
- **useExpenses**: Expenses queries
- **useSettlements**: Settlements queries
- **useStatistics**: Statistics queries
- **useNotifications**: Notifications queries

## Styling System

### TailwindCSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
        secondary: {
          50: "#f8fafc",
          500: "#64748b",
          900: "#0f172a",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
```

### Design System

- **Colors**: Primary, secondary, success, warning, error
- **Typography**: Heading, body, caption styles
- **Spacing**: Consistent spacing scale
- **Shadows**: Elevation system
- **Border Radius**: Consistent border radius
- **Animations**: Smooth transitions

## Performance Optimization

### Code Splitting

- Route-based code splitting
- Component lazy loading
- Dynamic imports for heavy components

### Caching Strategy

- React Query caching
- Local storage for user preferences
- Service worker for offline support

### Bundle Optimization

- Tree shaking
- Dynamic imports
- Image optimization
- Font optimization

## Accessibility

### WCAG Compliance

- Keyboard navigation
- Screen reader support
- Color contrast
- Focus management

### ARIA Attributes

- Proper labeling
- Role attributes
- State management
- Live regions

## Testing Strategy

### Unit Testing

- Jest + React Testing Library
- Component testing
- Hook testing
- Utility function testing

### Integration Testing

- API integration tests
- User flow tests
- Cross-browser testing

### E2E Testing

- Playwright for E2E tests
- Critical user journeys
- Performance testing

## Development Workflow

### Code Standards

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Husky pre-commit hooks

### Component Development

- Storybook for component development
- Component documentation
- Design system documentation
- Interactive examples

### Build Process

- Next.js build optimization
- Bundle analysis
- Performance monitoring
- Error tracking
