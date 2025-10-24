"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, useUpdateProfile } from "@/lib/api/hooks/auth";
import { useState } from "react";
// Note: Using console.log for now, replace with proper toast implementation
import { Loader2, Save, X } from "lucide-react";

interface EditProfileFormProps {
  user: User;
  onCancel: () => void;
  onSuccess: () => void;
}

export function EditProfileForm({
  user,
  onCancel,
  onSuccess,
}: EditProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateProfileMutation = useUpdateProfile();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Họ và tên là bắt buộc";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Họ và tên phải có ít nhất 2 ký tự";
    }

    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
      });

      console.log("Cập nhật thông tin thành công!");
      onSuccess();
    } catch (error: any) {
      console.error("Update profile error:", error);
      console.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin"
      );
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Họ và tên *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Nhập họ và tên"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="Nhập số điện thoại"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={user.email} disabled className="bg-gray-50" />
        <p className="text-sm text-gray-500">
          Email không thể thay đổi. Liên hệ hỗ trợ nếu cần thiết.
        </p>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={updateProfileMutation.isPending}
        >
          <X className="w-4 h-4 mr-2" />
          Hủy
        </Button>
        <Button type="submit" disabled={updateProfileMutation.isPending}>
          {updateProfileMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
}
