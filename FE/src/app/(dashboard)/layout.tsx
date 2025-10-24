"use client";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { useAuth } from "@/lib/api/hooks/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();

  console.log("Auth state:", { user, isAuthenticated, isLoading });

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
