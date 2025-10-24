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
import { useLogin } from "@/lib/api";
import { LoginFormData, loginSchema } from "@/lib/validations/auth";
import { useAuthStore } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const router = useRouter();
  const { login, clearError, isLoading, error } = useAuthStore();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();

    try {
      const response = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
        rememberMe: data.remember,
      });

      if (response.success && response.data) {
        // Lưu thông tin đăng nhập vào store
        login(
          response.data.user,
          response.data.accessToken,
          response.data.refreshToken
        );
        if (response.data.user && response.data.accessToken) {
          // Redirect đến dashboard
          router.push("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      // Error được xử lý tự động bởi React Query
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
          <CardDescription className="text-center">
            Nhập email và mật khẩu để đăng nhập vào tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(error || loginMutation.error) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error ||
                (loginMutation.error as any)?.message ||
                "Đăng nhập thất bại"}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register("email")}
                disabled={loginMutation.isPending || isSubmitting}
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
                disabled={loginMutation.isPending || isSubmitting}
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  {...register("remember")}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  disabled={loginMutation.isPending || isSubmitting}
                />
                <Label htmlFor="remember" className="text-sm">
                  Ghi nhớ đăng nhập
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending || isSubmitting}
            >
              {loginMutation.isPending || isSubmitting
                ? "Đang đăng nhập..."
                : "Đăng nhập"}
            </Button>
          </form>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
