import { formatDate } from "@/utils/formatters";

export default function SubmissionCard({ submission }) {
  return (
    <article className="card">
      <h3>{submission.student?.name || "Submission"}</h3>
      <p>{submission.text || submission.content || "No text response."}</p>
      <p className="muted">Submitted {formatDate(submission.createdAt || submission.submittedAt)}</p>
      {submission.grade != null && <span className="badge">{submission.grade} points</span>}
    </article>
  );
}
