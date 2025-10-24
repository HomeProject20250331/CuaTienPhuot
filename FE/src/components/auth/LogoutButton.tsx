"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/lib/api/hooks/auth";
import { authStorage } from "@/lib/auth/localStorage";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const logoutMutation = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    // Clear localStorage first
    authStorage.clearTokens();

    // Call logout API
    logoutMutation.mutate();

    // Redirect to login
    router.push("/login");
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="text-red-600 hover:text-red-700"
      disabled={logoutMutation.isPending}
    >
      {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
    </Button>
  );
}
