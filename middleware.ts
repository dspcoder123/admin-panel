import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the auth token from cookies
  const authToken = request.cookies.get("isLoggedIn")?.value;

  // If trying to access dashboard without authentication, redirect to login
  if (pathname.startsWith("/dashboard") && !authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If already logged in and trying to access login page, redirect to dashboard
  if (pathname === "/login" && authToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
