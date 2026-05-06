export default function QuizResults({ result }) {
  if (!result) return null;
  return (
    <section className="card">
      <h2>Quiz results</h2>
      <p className="muted">Score: {result.score ?? "Pending"} | Percentage: {result.percentage ?? "Pending"}</p>
      {result.feedback && <p>{result.feedback}</p>}
    </section>
  );
}
