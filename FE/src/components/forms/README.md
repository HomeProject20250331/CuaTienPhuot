# Form Components

Bộ form components được xây dựng theo SRS, sử dụng React Hook Form + Zod validation và Shadcn/ui components.

## Cấu trúc

### Basic Form Components

- `FormInput` - Input component với validation
- `FormTextarea` - Textarea component với validation
- `FormSelect` - Select component với validation

### Authentication Forms

- `LoginForm` - Form đăng nhập
- `RegisterForm` - Form đăng ký
- `ForgotPasswordForm` - Form quên mật khẩu

### Group Management Forms

- `CreateGroupForm` - Form tạo nhóm
- `EditGroupForm` - Form chỉnh sửa nhóm

### Expense Management Forms

- `AddExpenseForm` - Form thêm chi tiêu
- `EditExpenseForm` - Form chỉnh sửa chi tiêu

### Advanced Components

- `DatePicker` - Component chọn ngày
- `FileUpload` - Component upload file
- `MultiSelect` - Component chọn nhiều option

## Cách sử dụng

### 1. Import components

```typescript
import { LoginForm, RegisterForm } from "@/components/forms";
import { FormInput, FormSelect } from "@/components/forms";
```

### 2. Sử dụng form components

```typescript
// Authentication form
<LoginForm />

// Basic form components
<FormInput
  label="Email"
  placeholder="Nhập email"
  error={errors.email?.message}
  {...register("email")}
/>

<FormSelect
  label="Danh mục"
  options={categories}
  value={selectedCategory}
  onChange={setSelectedCategory}
/>
```

### 3. Validation schemas

Tất cả validation schemas được định nghĩa trong `@/lib/validations/`:

```typescript
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import {
  createGroupSchema,
  type CreateGroupFormData,
} from "@/lib/validations/group";
import {
  createExpenseSchema,
  type CreateExpenseFormData,
} from "@/lib/validations/expense";
```

## Features

### ✅ Type Safety

- Full TypeScript support với type inference
- Zod schema validation
- Type-safe form data

### ✅ Performance

- React Hook Form optimization
- Minimal re-renders
- Efficient validation

### ✅ Accessibility

- Built-in accessibility features từ Radix UI
- Keyboard navigation
- Screen reader support

### ✅ User Experience

- Real-time validation
- Error handling
- Loading states
- Responsive design

### ✅ Developer Experience

- Consistent API
- Reusable components
- Easy customization
- Comprehensive documentation

## Validation Rules

### Authentication

- **Email**: Required, valid email format
- **Password**: Min 8 characters, must contain uppercase, lowercase, and number
- **Name**: Min 2 characters, max 50 characters

### Groups

- **Name**: Required, min 2 characters, max 50 characters
- **Currency**: Required selection
- **Members**: Min 2 members, max 20 members

### Expenses

- **Title**: Required, min 2 characters, max 100 characters
- **Amount**: Required, min 0.01, max 999,999,999
- **Date**: Required date selection
- **Participants**: Min 1 participant, max 20 participants
- **Receipt**: Optional, max 5MB, image files only

## Customization

### Styling

Tất cả components sử dụng Tailwind CSS và có thể customize thông qua className props.

### Validation

Validation rules có thể được customize trong các schema files trong `@/lib/validations/`.

### Hooks

Custom hooks được cung cấp cho các operations:

- `useAuth` - Authentication operations
- `useGroups` - Group management operations
- `useExpenses` - Expense management operations

## Dependencies

- React Hook Form - Form state management
- Zod - Schema validation
- Radix UI - Accessible UI primitives
- Lucide React - Icons
- Date-fns - Date utilities
- React Day Picker - Calendar component
