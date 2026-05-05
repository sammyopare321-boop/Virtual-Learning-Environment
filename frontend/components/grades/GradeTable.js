import EmptyState from "@/components/shared/EmptyState";

export default function GradeTable({ rows = [] }) {
  if (!rows.length) return <EmptyState title="No grades yet" message="Grades will appear after submissions or quiz attempts are marked." />;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Item</th>
            <th>Score</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row._id || index}>
              <td>{row.student?.name || row.studentName || row.name || "Student"}</td>
              <td>{row.assignment?.title || row.quiz?.title || row.title || "Grade item"}</td>
              <td>{row.score ?? row.points ?? "-"}</td>
              <td>{row.percentage ?? row.finalGrade ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
