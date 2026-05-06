import Link from "next/link";
import Badge from "@/components/shared/Badge";

export default function QuizCard({ quiz, courseId }) {
  return (
    <article className="card">
      <h3>{quiz.title}</h3>
      <p>{quiz.description || "Quiz details will appear when opened."}</p>
      <div className="button-row">
        <Badge>{quiz.duration || quiz.timeLimit || "No"} min</Badge>
        <Link className="btn secondary" href={`/courses/${courseId}/quizzes/${quiz._id}`}>Open quiz</Link>
      </div>
    </article>
  );
}
