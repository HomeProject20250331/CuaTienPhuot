import { z } from "zod";

/**
 * Create Group Form Validation Schema
 */
export const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Tên nhóm là bắt buộc")
    .min(2, "Tên nhóm phải có ít nhất 2 ký tự")
    .max(50, "Tên nhóm không được quá 50 ký tự"),
  description: z.string().max(500, "Mô tả không được quá 500 ký tự").optional(),
  currency: z.string().min(1, "Vui lòng chọn đơn vị tiền tệ"),
  members: z
    .array(z.string())
    .min(2, "Nhóm phải có ít nhất 2 thành viên")
    .max(20, "Nhóm không được quá 20 thành viên"),
});

/**
 * Edit Group Form Validation Schema
 */
export const editGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Tên nhóm là bắt buộc")
    .min(2, "Tên nhóm phải có ít nhất 2 ký tự")
    .max(50, "Tên nhóm không được quá 50 ký tự"),
  description: z.string().max(500, "Mô tả không được quá 500 ký tự").optional(),
  currency: z.string().min(1, "Vui lòng chọn đơn vị tiền tệ"),
});

/**
 * Add Member to Group Form Validation Schema
 */
export const addMemberSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
});

/**
 * Remove Member from Group Form Validation Schema
 */
export const removeMemberSchema = z.object({
  memberId: z.string().min(1, "ID thành viên là bắt buộc"),
});

// Export types
export type CreateGroupFormData = z.infer<typeof createGroupSchema>;
export type EditGroupFormData = z.infer<typeof editGroupSchema>;
export type AddMemberFormData = z.infer<typeof addMemberSchema>;
export type RemoveMemberFormData = z.infer<typeof removeMemberSchema>;
