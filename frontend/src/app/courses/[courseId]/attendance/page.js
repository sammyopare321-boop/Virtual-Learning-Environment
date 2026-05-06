"use client";

import CourseLayout from "@/layouts/CourseLayout";
import AttendanceSummary from "@/components/attendance/AttendanceSummary";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import AttendanceRecord from "@/components/attendance/AttendanceRecord";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { attendanceApi } from "@/utils/api/attendanceApi";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext";
import { canManageCourse } from "@/utils/roleGuard";

export default function AttendancePage({ params }) {
  const { user } = useAuth();
  const teacherView = canManageCourse(user);
  const attendance = useFetch(() => teacherView ? attendanceApi.getSummary(params.courseId) : attendanceApi.getMyAttendance(params.courseId), [params.courseId, teacherView]);
  const rows = Array.isArray(attendance.data) ? attendance.data : attendance.data?.records || [];

  return (
    <CourseLayout courseId={params.courseId} title="Attendance">
      {attendance.loading && <Loader label="Loading attendance" />}
      <ErrorMessage message={attendance.error} />
      <div className="form-grid">
        <AttendanceSummary summary={attendance.data || {}} />
        {teacherView ? <AttendanceTable records={rows} /> : <div className="card-grid">{rows.map((record) => <AttendanceRecord key={record._id} record={record} />)}</div>}
      </div>
    </CourseLayout>
  );
}
