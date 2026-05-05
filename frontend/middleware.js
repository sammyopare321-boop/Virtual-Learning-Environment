import { NextResponse } from "next/server";

const protectedPrefixes = [
  "/dashboard",
  "/courses",
  "/admin",
  "/messages",
  "/notifications",
  "/profile"
];

const routePermissions = {
  "/dashboard/admin": ["admin"],
  "/dashboard/teacher": ["teacher"],
  "/dashboard/student": ["student"],
  "/admin": ["admin"]
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  if (!token && protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token && role) {
    for (const [route, allowedRoles] of Object.entries(routePermissions)) {
      if (pathname.startsWith(route) && !allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/courses/:path*",
    "/admin/:path*",
    "/messages/:path*",
    "/notifications/:path*",
    "/profile/:path*"
  ]
};
