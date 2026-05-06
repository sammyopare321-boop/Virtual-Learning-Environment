import { formatDate } from "@/utils/formatters";
import JoinButton from "@/components/live/JoinButton";

export default function LiveSessionCard({ session, courseId }) {
  return (
    <article className="card">
      <h3>{session.title || "Live class"}</h3>
      <p>{session.description || "Virtual classroom session."}</p>
      <p className="muted">Starts {formatDate(session.startTime || session.scheduledAt)}</p>
      <JoinButton courseId={courseId} session={session} />
    </article>
  );
}
