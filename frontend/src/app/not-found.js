import Link from "next/link";

export default function NotFound() {
  return (
    <section className="empty-state">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p className="muted">The page you requested is not part of this learning workspace.</p>
      <Link className="btn" href="/">Return home</Link>
    </section>
  );
}
