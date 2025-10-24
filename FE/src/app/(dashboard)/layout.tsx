"use client";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/lib/api/hooks/auth";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (!user && !isLoading) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header isAuthenticated={true} />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {isLoading ? <div>Đang tải...</div> : children}
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
