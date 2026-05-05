import { formatShortDate } from "@/utils/formatters";

export default function ModuleCard({ module }) {
  return (
    <article className="card">
      <h3>{module.title}</h3>
      <p>{module.description || "No description provided."}</p>
      <p className="muted">Order: {module.order ?? "Not set"} | Created {formatShortDate(module.createdAt)}</p>
    </article>
  );
}
