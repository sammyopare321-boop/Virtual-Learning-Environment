import Link from "next/link";

export default function CourseLayout({ courseId, title, children }) {
  const links = [
    ["Overview", `/courses/${courseId}`],
    ["Modules", `/courses/${courseId}/modules`],
    ["Assignments", `/courses/${courseId}/assignments`],
    ["Quizzes", `/courses/${courseId}/quizzes`],
    ["Grades", `/courses/${courseId}/grades`],
    ["Attendance", `/courses/${courseId}/attendance`],
    ["Announcements", `/courses/${courseId}/announcements`],
    ["Discussions", `/courses/${courseId}/discussions`],
    ["Live", `/courses/${courseId}/live`]
  ];

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Course workspace</p>
          <h1>{title || "Course"}</h1>
        </div>
      </div>
      <div className="course-shell">
        <aside className="sidebar">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </aside>
        <div>{children}</div>
      </div>
    </section>
  );
}
