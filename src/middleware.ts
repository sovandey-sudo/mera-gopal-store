import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  // Rate limit auth-related POSTs (login credentials)
  if (
    req.method === "POST" &&
    (path.startsWith("/api/auth/callback/credentials") ||
      path === "/api/auth/signin" ||
      path.startsWith("/api/auth/callback"))
  ) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = checkRateLimit(`login:${ip}`, RATE_LIMITS.login);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(rl.retryAfterSeconds) },
        }
      );
    }
  }

  // Admin routes protection
  const isAdminRoute = path.startsWith("/admin");
  const isAdminLogin = path === "/admin/login";

  if (isAdminRoute && !isAdminLogin) {
    if (!isLoggedIn || !isAdmin) {
      const loginUrl = new URL("/admin/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isAdminLogin && isLoggedIn && isAdmin) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

  // Customer account routes protection
  const isAccountRoute = path.startsWith("/account");
  if (isAccountRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/api/auth/:path*",
  ],
};
