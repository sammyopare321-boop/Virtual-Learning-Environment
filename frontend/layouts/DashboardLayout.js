export default function DashboardLayout({ title, subtitle, children }) {
  return (
    <section>
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
