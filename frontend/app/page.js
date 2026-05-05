import Link from "next/link";

export default function HomePage() {
  return (
    <section>
      <div className="hero">
        <div className="hero-copy">
          <p className="eyebrow">University LMS</p>
          <h1>Virtual Learning Environment</h1>
          <p>A focused academic workspace for courses, modules, assignments, quizzes, attendance, grades, discussions, messages, live sessions, and admin oversight.</p>
          <div className="button-row">
            <Link className="btn" href="/courses">Browse courses</Link>
            <Link className="btn secondary" href="/auth/login">Sign in</Link>
          </div>
        </div>
        <div className="hero-panel">
          <h2>Learning tools</h2>
          <div className="hero-stat-grid">
            <div className="stat"><strong>01</strong><span>Course delivery</span></div>
            <div className="stat"><strong>02</strong><span>Assessment</span></div>
            <div className="stat"><strong>03</strong><span>Engagement</span></div>
            <div className="stat"><strong>04</strong><span>Administration</span></div>
          </div>
        </div>
      </div>
      <div className="card-grid">
        {["Modules and content", "Assignments and submissions", "Grades and attendance"].map((title) => (
          <article className="card" key={title}>
            <h3>{title}</h3>
            <p className="muted">Built to connect directly to the existing backend API.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
