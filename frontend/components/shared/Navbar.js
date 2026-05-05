"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { dashboardPath } from "@/utils/roleGuard";
import { useNotifications } from "@/hooks/useNotifications";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const linkClass = (href) => pathname === href || pathname.startsWith(`${href}/`) ? "active" : "";

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand" aria-label="Virtual Learning Environment home">
          <span className="brand-mark">VL</span>
          <span>Virtual Learning</span>
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link className={linkClass("/courses")} href="/courses">Courses</Link>
          {user ? (
            <>
              <Link className={linkClass("/dashboard")} href={dashboardPath(user.role)}>Dashboard</Link>
              <Link className={linkClass("/messages")} href="/messages">Messages</Link>
              <Link className={linkClass("/notifications")} href="/notifications">
                Notifications{unreadCount ? ` (${unreadCount})` : ""}
              </Link>
              <Link className={linkClass("/profile")} href="/profile">Profile</Link>
              {user.role === "admin" && <Link className={linkClass("/dashboard/admin")} href="/dashboard/admin">Admin</Link>}
              <button type="button" onClick={logout}>Sign out</button>
            </>
          ) : (
            <>
              <Link className={linkClass("/auth/login")} href="/auth/login">Login</Link>
              <Link className={linkClass("/auth/register")} href="/auth/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
