import GradeChart from "@/components/grades/GradeChart";

export default function GradeDistributionChart({ data = {} }) {
  return <GradeChart data={data.distribution || data} />;
}
