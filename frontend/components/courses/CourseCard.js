import Link from "next/link";
import Badge from "@/components/shared/Badge";

export default function CourseCard({ course }) {
  return (
    <article className="card">
      <div className="page-header" style={{ marginBottom: 8 }}>
        <div>
          <h3>{course.title}</h3>
          <p className="muted">{course.code}</p>
        </div>
        <Badge tone={course.status === "active" ? "blue" : "red"}>{course.status || "draft"}</Badge>
      </div>
      <p>{course.description}</p>
      <p className="muted">Teacher: {course.teacher?.name || "Unassigned"}</p>
      <Link className="btn secondary" href={`/courses/${course._id}`}>Open course</Link>
    </article>
  );
}
