"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/lib/api";
import { RegisterFormData, registerSchema } from "@/lib/validations/auth";
import { useAuthStore } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
  const router = useRouter();
  const { login, clearError, isLoading, error } = useAuthStore();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    clearError();

    try {
      const response = await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        acceptTerms: data.acceptTerms,
      });

      if (response.success && response.data) {
        // Lưu thông tin đăng nhập vào store
        login(
          response.data.user,
          response.data.accessToken,
          response.data.refreshToken
        );

        // Redirect đến dashboard
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      // Error được xử lý tự động bởi React Query
    }
  };

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    const { isLoggedIn } = useAuthStore.getState();
    if (isLoggedIn()) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="max-w-md w-full space-y-8">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Đăng ký</CardTitle>
          <CardDescription className="text-center">
            Tạo tài khoản mới để bắt đầu sử dụng CuaTienPhuot
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(error || registerMutation.error) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error ||
                (registerMutation.error as any)?.message ||
                "Đăng ký thất bại"}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nguyễn Văn A"
                {...register("name")}
                disabled={registerMutation.isPending || isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register("email")}
                disabled={registerMutation.isPending || isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                disabled={registerMutation.isPending || isSubmitting}
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                disabled={registerMutation.isPending || isSubmitting}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="acceptTerms"
                type="checkbox"
                {...register("acceptTerms")}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                disabled={registerMutation.isPending || isSubmitting}
              />
              <Label htmlFor="acceptTerms" className="text-sm">
                Tôi đồng ý với{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Điều khoản sử dụng
                </Link>{" "}
                và{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Chính sách bảo mật
                </Link>
              </Label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-red-600">
                {errors.acceptTerms.message}
              </p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending || isSubmitting}
            >
              {registerMutation.isPending || isSubmitting
                ? "Đang đăng ký..."
                : "Đăng ký"}
            </Button>
          </form>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
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
