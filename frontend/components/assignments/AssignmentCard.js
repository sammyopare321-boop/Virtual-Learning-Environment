import Link from "next/link";
import Badge from "@/components/shared/Badge";
import { formatDate } from "@/utils/formatters";

export default function AssignmentCard({ assignment, courseId }) {
  return (
    <article className="card">
      <div className="page-header" style={{ marginBottom: 8 }}>
        <h3>{assignment.title}</h3>
        <Badge>{assignment.points ?? assignment.totalPoints ?? 0} pts</Badge>
      </div>
      <p>{assignment.description || "No description provided."}</p>
      <p className="muted">Due {formatDate(assignment.dueDate)}</p>
      <Link className="btn secondary" href={`/courses/${courseId}/assignments/${assignment._id}`}>View assignment</Link>
    </article>
  );
}
