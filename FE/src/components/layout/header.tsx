"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "../auth/LogoutButton";

interface HeaderProps {
  isAuthenticated?: boolean;
}

export default function Header({ isAuthenticated = false }: HeaderProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Trang chủ", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Nhóm", href: "/groups" },
    { name: "Thông báo", href: "/notifications" },
  ];

  const authNavigation = [
    { name: "Đăng nhập", href: "/login" },
    { name: "Đăng ký", href: "/register" },
  ];

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              CuaTienPhuot
            </Link>

            {/* Navigation - chỉ hiển thị khi đã đăng nhập */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center space-x-6">
                {navigation.slice(1).map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-gray-600 hover:text-gray-900 transition-colors",
                      pathname === item.href && "text-primary font-medium"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile">Profile</Link>
                </Button>
                <LogoutButton />
              </>
            ) : (
              <div className="flex items-center space-x-2">
                {authNavigation.map((item) => (
                  <Button
                    key={item.name}
                    variant={item.name === "Đăng ký" ? "default" : "outline"}
                    size="sm"
                    asChild
                  >
                    <Link href={item.href}>{item.name}</Link>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
