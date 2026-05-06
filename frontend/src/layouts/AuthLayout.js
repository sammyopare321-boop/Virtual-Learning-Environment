export default function AuthLayout({ title, children }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Virtual Learning Environment</p>
        <h1>{title}</h1>
        <p>Access courses, assignments, grades, attendance, announcements, discussions, and live learning sessions from one clear academic workspace.</p>
      </div>
      <div>{children}</div>
    </section>
  );
}
