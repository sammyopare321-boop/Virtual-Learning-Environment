"use client";

import { adminApi } from "@/utils/api/adminApi";
import Badge from "@/components/shared/Badge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

export default function CourseAdminTable({ courses = [], onChanged }) {
  const changeStatus = async (id, status) => {
    await adminApi.changeCourseStatus(id, status);
    onChanged?.();
  };

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Course</th><th>Code</th><th>Teacher</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td>{course.title}</td>
              <td>{course.code}</td>
              <td>{course.teacher?.name || "Unassigned"}</td>
              <td><Badge>{course.status}</Badge></td>
              <td>
                <div className="button-row">
                  <select className="select" value={course.status} onChange={(e) => changeStatus(course._id, e.target.value)} aria-label="Change course status">
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                  <ConfirmDialog message={`Delete ${course.title}?`} confirmLabel="Delete" onConfirm={async () => { await adminApi.deleteCourse(course._id); onChanged?.(); }} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
