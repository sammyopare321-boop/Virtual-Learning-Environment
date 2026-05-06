export default function Badge({ children, tone = "blue" }) {
  return <span className={`badge ${tone === "red" ? "red" : ""}`}>{children}</span>;
}
