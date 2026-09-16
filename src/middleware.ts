import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/modules/auth/lib/session";
import { checkRateLimit, getRateLimitHeaders } from "@/modules/rate-limit";

const publicPaths = ["/", "/login", "/register", "/dashboard", "/api/auth/login", "/api/auth/register"];
const healthPath = "/api/health";

function setSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Health check is always public
  if (pathname === healthPath) {
    return setSecurityHeaders(NextResponse.next());
  }

  // Public paths bypass auth
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    // Rate limit auth endpoints
    if (pathname.startsWith("/api/auth/")) {
      const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
      const result = checkRateLimit(`auth:${ip}`, { windowMs: 60000, maxRequests: 20 });
      if (!result.allowed) {
        return setSecurityHeaders(
          NextResponse.json(
            { success: false, error: { code: "RATE_LIMITED", message: "Too many requests" } },
            { status: 429 }
          )
        );
      }
    }
    return setSecurityHeaders(NextResponse.next());
  }

  // API routes
  if (pathname.startsWith("/api/")) {
    // Rate limit all API routes
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const result = checkRateLimit(`api:${ip}`, { windowMs: 60000, maxRequests: 100 });
    if (!result.allowed) {
      const response = NextResponse.json(
        { success: false, error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      );
      Object.entries(getRateLimitHeaders(result)).forEach(([k, v]) => response.headers.set(k, v));
      return setSecurityHeaders(response);
    }

    const token = request.cookies.get("plinth.session")?.value;
    if (!token) {
      return setSecurityHeaders(
        NextResponse.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
          { status: 401 }
        )
      );
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return setSecurityHeaders(
        NextResponse.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Invalid session" } },
          { status: 401 }
        )
      );
    }

    const response = NextResponse.next();
    Object.entries(getRateLimitHeaders(result)).forEach(([k, v]) => response.headers.set(k, v));
    return setSecurityHeaders(response);
  }

  // Page routes
  const token = request.cookies.get("plinth.session")?.value;
  if (!token) {
    return setSecurityHeaders(NextResponse.redirect(new URL("/login", request.url)));
  }

  const session = await verifySessionToken(token);
  if (!session) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("plinth.session");
    return setSecurityHeaders(response);
  }

  return setSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
