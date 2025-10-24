"use client";

import { FormInput } from "@/components/forms";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useResetPassword } from "@/lib/api";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      return;
    }

    try {
      const response = await resetPasswordMutation.mutateAsync({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (response.success) {
        router.push("/login?message=password-reset-success");
      }
    } catch (error: any) {
      console.error("Reset password failed:", error);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Lỗi</CardTitle>
            <CardDescription className="text-center">
              Token không hợp lệ hoặc đã hết hạn
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/forgot-password">Quay lại</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full space-y-8">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Đặt lại mật khẩu
          </CardTitle>
          <CardDescription className="text-center">
            Nhập mật khẩu mới cho tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {resetPasswordMutation.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {(resetPasswordMutation.error as any)?.message ||
                "Đặt lại mật khẩu thất bại"}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label="Mật khẩu mới"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
              disabled={resetPasswordMutation.isPending || isSubmitting}
            />
            <FormInput
              label="Xác nhận mật khẩu mới"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              disabled={resetPasswordMutation.isPending || isSubmitting}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={resetPasswordMutation.isPending || isSubmitting}
            >
              {resetPasswordMutation.isPending || isSubmitting
                ? "Đang đặt lại..."
                : "Đặt lại mật khẩu"}
            </Button>
          </form>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Nhớ mật khẩu?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
