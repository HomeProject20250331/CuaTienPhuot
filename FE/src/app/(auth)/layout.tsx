"use client";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { useAuth } from "@/lib/api";
import { redirect } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    redirect("/");
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header isAuthenticated={false} />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
