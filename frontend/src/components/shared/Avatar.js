export default function Avatar({ name = "User" }) {
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <span className="brand-mark" aria-hidden="true">{initials || "U"}</span>;
}
