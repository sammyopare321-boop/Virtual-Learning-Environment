import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Define which roles can access which route prefixes
const routePermissions = {
  '/dashboard/admin': ['admin'],
  '/dashboard/teacher': ['teacher'],
  '/dashboard/student': ['student'],
  '/admin': ['admin'],
};

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users to login
  if (!token) {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/courses') ||
        pathname.startsWith('/admin') || pathname.startsWith('/messages')) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    const decoded = jwtDecode(token);

    // Check role-based access
    for (const [route, allowedRoles] of Object.entries(routePermissions)) {
      if (pathname.startsWith(route) && !allowedRoles.includes(decoded.role)) {
        // Redirect to their own dashboard
        return NextResponse.redirect(
          new URL(`/dashboard/${decoded.role}`, request.url)
        );
      }
    }

    return NextResponse.next();
  } catch {
    // Invalid token — clear and redirect to login
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/courses/:path*', '/admin/:path*',
            '/messages/:path*', '/notifications/:path*', '/profile/:path*']
};
