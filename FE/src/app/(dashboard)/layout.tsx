"use client";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authLoading, shouldRender } = useAuthGuard();

  // Hiển thị loading khi đang kiểm tra authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Không render gì nếu chưa đăng nhập (sẽ redirect về login)
  if (!shouldRender) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header isAuthenticated={true} />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
