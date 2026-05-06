import GradeChart from "@/components/grades/GradeChart";

export default function AttendanceRateChart({ data = {} }) {
  const chartData = (data.courseBreakdown || []).map((item) => ({
    name: item.courseTitle,
    value: Number(item.attendanceRate?.toFixed?.(1) || item.attendanceRate || 0)
  }));
  return <GradeChart data={chartData} />;
}
