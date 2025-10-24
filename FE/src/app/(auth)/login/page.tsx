"use client";

import { LoginForm } from "@/components/forms";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="w-full flex items-center justify-center px-4 ">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại!</h1>
          <p className="">Đăng nhập để tiếp tục sử dụng CuaTienPhuot</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0 w-full">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
            <CardDescription className="text-center">
              Nhập thông tin của bạn để đăng nhập
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />

            {/* Forgot Password Link */}
            <div className="mt-4 text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
