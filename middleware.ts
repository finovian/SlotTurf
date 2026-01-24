import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read token from cookies
  const accessToken = request.cookies.get("access_token")?.value;

  // Routes
  const isLoginPage = pathname === "/login";
  const isProtectedRoute = pathname.startsWith("/dashboard");

  // 🚫 Not logged in → trying to access protected page
  if (!accessToken && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Logged in → trying to access login page
  if (accessToken && isLoginPage) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/profile-setup",
    "/",
    "/admin/:path*",
  ],
};
