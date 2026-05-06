import EmptyState from "@/components/shared/EmptyState";

export default function AtRiskTable({ students = [] }) {
  if (!students.length) return <EmptyState title="No at-risk students" message="Students below the configured threshold will appear here." />;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Student</th><th>Email</th><th>Grade</th></tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id || student.email}>
              <td>{student.name || student.student?.name}</td>
              <td>{student.email || student.student?.email}</td>
              <td>{student.finalGrade ?? student.percentage ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
