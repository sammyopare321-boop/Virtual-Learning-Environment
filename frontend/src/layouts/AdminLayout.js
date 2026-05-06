import Link from "next/link";
import ImpersonationBanner from "@/components/admin/ImpersonationBanner";

export default function AdminLayout({ title, children }) {
  const links = [
    ["Overview", "/admin"],
    ["Users", "/admin/users"],
    ["Courses", "/admin/courses"],
    ["Analytics", "/admin/analytics"],
    ["Logs", "/admin/logs"]
  ];

  return (
    <section>
      <ImpersonationBanner />
      <div className="page-header">
        <div>
          <p className="eyebrow">Administration</p>
          <h1>{title}</h1>
        </div>
      </div>
      <div className="course-shell">
        <aside className="sidebar">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </aside>
        <div>{children}</div>
      </div>
    </section>
  );
}
