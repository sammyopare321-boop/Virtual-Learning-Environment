"use client";

import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <section className="empty-state">
      <p className="eyebrow">Application error</p>
      <h1>Something went wrong</h1>
      <p className="muted">{error?.message || "The page could not be loaded."}</p>
      <div className="button-row" style={{ justifyContent: "center" }}>
        <button className="btn" onClick={reset}>Try again</button>
        <Link className="btn secondary" href="/">Go home</Link>
      </div>
    </section>
  );
}
