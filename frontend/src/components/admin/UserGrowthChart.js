import GradeChart from "@/components/grades/GradeChart";

export default function UserGrowthChart({ data = [] }) {
  const chartData = data.map((item) => ({
    name: `${item._id?.month || ""}/${item._id?.year || ""}`,
    value: item.count
  }));
  return <GradeChart data={chartData} />;
}
