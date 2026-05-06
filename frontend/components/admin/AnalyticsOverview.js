export default function AnalyticsOverview({ data = {} }) {
  const stats = [
    ["Users", data.totalUsers],
    ["Students", data.totalStudents],
    ["Teachers", data.totalTeachers],
    ["Courses", data.totalCourses],
    ["Active courses", data.activeCourses],
    ["Enrollments", data.totalEnrollments],
    ["Submissions", data.totalSubmissions],
    ["Quiz attempts", data.totalQuizAttempts]
  ];

  return (
    <section className="stats-grid">
      {stats.map(([label, value]) => (
        <div className="stat" key={label}>
          <strong>{value ?? 0}</strong>
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}
