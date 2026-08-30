import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const role = token?.role as string | undefined;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  // Admin routes
  const isAdminRoute = path.startsWith("/admin");
  const isAdminLogin = path === "/admin/login";

  if (isAdminRoute && !isAdminLogin) {
    if (!isLoggedIn || !isAdmin) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isAdminLogin && isLoggedIn && isAdmin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Customer account routes
  const isAccountRoute = path.startsWith("/account");

  if (isAccountRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
  ],
};
