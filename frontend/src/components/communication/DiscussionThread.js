import Link from "next/link";
import { formatDate } from "@/utils/formatters";

export default function DiscussionThread({ discussion, courseId }) {
  return (
    <article className="card">
      <h3>{discussion.title || discussion.subject}</h3>
      <p>{discussion.message || discussion.content}</p>
      <p className="muted">{formatDate(discussion.createdAt)}</p>
      {courseId && <Link className="btn secondary" href={`/courses/${courseId}/discussions/${discussion._id}`}>Open thread</Link>}
    </article>
  );
}
