import { z } from "zod";

/**
 * Create Expense Form Validation Schema
 */
export const createExpenseSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề là bắt buộc")
    .min(2, "Tiêu đề phải có ít nhất 2 ký tự")
    .max(100, "Tiêu đề không được quá 100 ký tự"),
  amount: z
    .number()
    .min(0.01, "Số tiền phải lớn hơn 0")
    .max(999999999, "Số tiền quá lớn"),
  description: z.string().max(500, "Mô tả không được quá 500 ký tự").optional(),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  date: z.date({
    required_error: "Ngày chi tiêu là bắt buộc",
  }),
  participants: z
    .array(z.string())
    .min(1, "Phải có ít nhất 1 người tham gia")
    .max(20, "Không được quá 20 người tham gia"),
  paidBy: z.string().min(1, "Vui lòng chọn người thanh toán"),
  receipt: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "File không được vượt quá 5MB"
    )
    .refine(
      (file) => !file || file.type.startsWith("image/"),
      "Chỉ chấp nhận file hình ảnh"
    ),
});

/**
 * Edit Expense Form Validation Schema
 */
export const editExpenseSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề là bắt buộc")
    .min(2, "Tiêu đề phải có ít nhất 2 ký tự")
    .max(100, "Tiêu đề không được quá 100 ký tự"),
  amount: z
    .number()
    .min(0.01, "Số tiền phải lớn hơn 0")
    .max(999999999, "Số tiền quá lớn"),
  description: z.string().max(500, "Mô tả không được quá 500 ký tự").optional(),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  date: z.date({
    required_error: "Ngày chi tiêu là bắt buộc",
  }),
  participants: z
    .array(z.string())
    .min(1, "Phải có ít nhất 1 người tham gia")
    .max(20, "Không được quá 20 người tham gia"),
  paidBy: z.string().min(1, "Vui lòng chọn người thanh toán"),
  receipt: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "File không được vượt quá 5MB"
    )
    .refine(
      (file) => !file || file.type.startsWith("image/"),
      "Chỉ chấp nhận file hình ảnh"
    ),
});

/**
 * Split Expense Form Validation Schema
 */
export const splitExpenseSchema = z.object({
  expenseId: z.string().min(1, "ID chi tiêu là bắt buộc"),
  splitType: z.enum(["equal", "custom"], {
    required_error: "Vui lòng chọn cách chia",
  }),
  customAmounts: z
    .array(
      z.object({
        userId: z.string(),
        amount: z.number().min(0.01),
      })
    )
    .optional(),
});

// Export types
export type CreateExpenseFormData = z.infer<typeof createExpenseSchema>;
export type EditExpenseFormData = z.infer<typeof editExpenseSchema>;
export type SplitExpenseFormData = z.infer<typeof splitExpenseSchema>;
