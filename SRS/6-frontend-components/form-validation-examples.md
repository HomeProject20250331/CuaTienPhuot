# Form Validation Examples - React Hook Form + Zod

## Tổng quan

Tài liệu này cung cấp các ví dụ cụ thể về cách sử dụng React Hook Form kết hợp với Zod validation trong ứng dụng CuaTienPhuot.

## 1. Authentication Forms

### Login Form

```typescript
// lib/validations/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

```typescript
// components/forms/LoginForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm() {
  const { login, isLoading } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {
      // Error handling được xử lý trong useAuth hook
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
    </Form>
  );
}
```

### Register Form

```typescript
// lib/validations/auth.ts
export const registerSchema = z
  .object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
```

```typescript
// components/forms/RegisterForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function RegisterForm() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    // Handle registration
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input placeholder="Nhập họ và tên" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Xác nhận mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Đăng ký
        </Button>
      </form>
    </Form>
  );
}
```

## 2. Group Management Forms

### Create Group Form

```typescript
// lib/validations/group.ts
import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(1, "Tên nhóm không được để trống"),
  description: z.string().optional(),
  currency: z.string().min(1, "Vui lòng chọn đơn vị tiền tệ"),
  members: z.array(z.string()).min(2, "Nhóm phải có ít nhất 2 thành viên"),
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;
```

```typescript
// components/forms/CreateGroupForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createGroupSchema,
  type CreateGroupFormData,
} from "@/lib/validations/group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";

const CURRENCIES = [
  { value: "VND", label: "Việt Nam Đồng (VND)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
];

export function CreateGroupForm() {
  const form = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      currency: "",
      members: [],
    },
  });

  const onSubmit = async (data: CreateGroupFormData) => {
    // Handle group creation
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên nhóm</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên nhóm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả (tùy chọn)</FormLabel>
              <FormControl>
                <Textarea placeholder="Mô tả về nhóm..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đơn vị tiền tệ</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn vị tiền tệ" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="members"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thành viên</FormLabel>
              <FormControl>
                <MultiSelect
                  options={[]} // Load from API
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Chọn thành viên..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Tạo nhóm
        </Button>
      </form>
    </Form>
  );
}
```

## 3. Expense Management Forms

### Add Expense Form

```typescript
// lib/validations/expense.ts
import { z } from "zod";

export const createExpenseSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  amount: z.number().min(0.01, "Số tiền phải lớn hơn 0"),
  description: z.string().optional(),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  date: z.date(),
  participants: z.array(z.string()).min(1, "Phải có ít nhất 1 người tham gia"),
  paidBy: z.string().min(1, "Vui lòng chọn người thanh toán"),
  receipt: z.instanceof(File).optional(),
});

export type CreateExpenseFormData = z.infer<typeof createExpenseSchema>;
```

```typescript
// components/forms/AddExpenseForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createExpenseSchema,
  type CreateExpenseFormData,
} from "@/lib/validations/expense";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { FileUpload } from "@/components/ui/file-upload";

const CATEGORIES = [
  { value: "food", label: "Ăn uống" },
  { value: "transport", label: "Di chuyển" },
  { value: "accommodation", label: "Chỗ ở" },
  { value: "entertainment", label: "Giải trí" },
  { value: "shopping", label: "Mua sắm" },
  { value: "other", label: "Khác" },
];

export function AddExpenseForm({ groupId }: { groupId: string }) {
  const form = useForm<CreateExpenseFormData>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      title: "",
      amount: 0,
      description: "",
      category: "",
      date: new Date(),
      participants: [],
      paidBy: "",
      receipt: undefined,
    },
  });

  const onSubmit = async (data: CreateExpenseFormData) => {
    // Handle expense creation
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tiêu đề chi tiêu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số tiền</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả (tùy chọn)</FormLabel>
              <FormControl>
                <Textarea placeholder="Mô tả chi tiết..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày chi tiêu</FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="receipt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hóa đơn (tùy chọn)</FormLabel>
              <FormControl>
                <FileUpload
                  value={field.value ? [field.value] : []}
                  onChange={(files) => field.onChange(files[0])}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024} // 5MB
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Thêm chi tiêu
        </Button>
      </form>
    </Form>
  );
}
```

## 4. Advanced Validation Examples

### Custom Validation Rules

```typescript
// lib/validations/custom.ts
import { z } from "zod";

// Custom validation cho số tiền
export const amountSchema = z
  .number()
  .min(0.01, "Số tiền phải lớn hơn 0")
  .max(999999999, "Số tiền quá lớn");

// Custom validation cho email domain
export const emailDomainSchema = z
  .string()
  .email("Email không hợp lệ")
  .refine((email) => {
    const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"];
    const domain = email.split("@")[1];
    return allowedDomains.includes(domain);
  }, "Chỉ chấp nhận email từ Gmail, Yahoo, Outlook");

// Custom validation cho password strength
export const strongPasswordSchema = z
  .string()
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
  );

// Custom validation cho file upload
export const imageFileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    "File không được vượt quá 5MB"
  )
  .refine(
    (file) => file.type.startsWith("image/"),
    "Chỉ chấp nhận file hình ảnh"
  );
```

### Async Validation

```typescript
// lib/validations/async.ts
import { z } from "zod";

// Async validation cho email uniqueness
export const uniqueEmailSchema = z
  .string()
  .email("Email không hợp lệ")
  .refine(async (email) => {
    // Check if email exists in database
    const response = await fetch(`/api/auth/check-email?email=${email}`);
    const data = await response.json();
    return !data.exists;
  }, "Email đã được sử dụng");

// Async validation cho group name uniqueness
export const uniqueGroupNameSchema = z
  .string()
  .min(1, "Tên nhóm không được để trống")
  .refine(async (name) => {
    const response = await fetch(`/api/groups/check-name?name=${name}`);
    const data = await response.json();
    return !data.exists;
  }, "Tên nhóm đã được sử dụng");
```

## 5. Form Error Handling

### Global Error Handling

```typescript
// components/forms/FormErrorHandler.tsx
import { useFormContext } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function FormErrorHandler() {
  const { formState } = useFormContext();
  const { errors } = formState;

  if (Object.keys(errors).length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Vui lòng kiểm tra lại thông tin đã nhập
      </AlertDescription>
    </Alert>
  );
}
```

### Field-level Error Display

```typescript
// components/forms/FormFieldWithError.tsx
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormFieldWithErrorProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
}

export function FormFieldWithError({
  name,
  label,
  placeholder,
  type = "text",
}: FormFieldWithErrorProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
```

## 6. Performance Optimization

### Form Performance Best Practices

```typescript
// hooks/useFormOptimization.ts
import { useForm } from "react-hook-form";
import { useCallback, useMemo } from "react";

export function useFormOptimization<T extends Record<string, any>>(
  schema: any,
  defaultValues: T
) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange", // Validate on change for better UX
    reValidateMode: "onChange",
  });

  // Memoize form submission handler
  const handleSubmit = useCallback(
    (onSubmit: (data: T) => void) => {
      return form.handleSubmit(onSubmit);
    },
    [form]
  );

  // Memoize form reset
  const resetForm = useCallback(() => {
    form.reset(defaultValues);
  }, [form, defaultValues]);

  return {
    form,
    handleSubmit,
    resetForm,
  };
}
```

## 7. Testing Form Components

### Form Testing Utilities

```typescript
// __tests__/utils/form-test-utils.tsx
import { render, screen } from "@testing-library/react";
import { FormProvider } from "react-hook-form";
import { useForm } from "react-hook-form";

export function renderWithForm(
  component: React.ReactElement,
  defaultValues: any = {}
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const form = useForm({ defaultValues });
    return <FormProvider {...form}>{children}</FormProvider>;
  };

  return render(component, { wrapper: Wrapper });
}

// Test form validation
export async function testFormValidation(
  formElement: HTMLElement,
  expectedErrors: string[]
) {
  const submitButton = screen.getByRole("button", { name: /submit/i });
  await userEvent.click(submitButton);

  for (const error of expectedErrors) {
    expect(screen.getByText(error)).toBeInTheDocument();
  }
}
```

## Kết luận

Việc sử dụng React Hook Form kết hợp với Zod validation và Shadcn/ui components mang lại:

- **Type Safety**: Full TypeScript support với type inference
- **Performance**: Optimized re-renders và validation
- **Developer Experience**: Intuitive API và excellent tooling
- **User Experience**: Real-time validation và smooth interactions
- **Maintainability**: Clean, reusable form components
- **Accessibility**: Built-in accessibility features từ Radix UI

Tất cả form trong ứng dụng CuaTienPhuot đều tuân theo pattern này để đảm bảo consistency và maintainability.
