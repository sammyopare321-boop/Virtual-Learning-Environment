import { percent } from "@/utils/formatters";

export default function FinalGradeCard({ grade }) {
  return (
    <section className="stat">
      <strong>{percent(grade?.finalGrade ?? grade?.percentage ?? grade ?? 0)}</strong>
      <span>Final grade</span>
    </section>
  );
}
