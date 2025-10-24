import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Middleware không thể truy cập localStorage
  // Authentication sẽ được handle ở client-side
  // Chỉ redirect các route cơ bản

  // Auth routes - có thể redirect nếu cần
  if (
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register")
  ) {
    // Client-side sẽ check localStorage và redirect nếu cần
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
