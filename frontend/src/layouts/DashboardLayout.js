import ImpersonationBanner from "@/components/admin/ImpersonationBanner";

export default function DashboardLayout({ title, subtitle, children }) {
  return (
    <section>
      <ImpersonationBanner />
      <div className="page-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>{title}</h1>
          {subtitle && <p className="muted">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}
