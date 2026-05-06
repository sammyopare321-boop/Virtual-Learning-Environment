import Avatar from "@/components/shared/Avatar";
import Badge from "@/components/shared/Badge";

export default function ProfileCard({ user }) {
  return (
    <section className="card">
      <div className="button-row">
        <Avatar name={user?.name} />
        <div>
          <h2>{user?.name || "Your profile"}</h2>
          <p className="muted">{user?.email}</p>
        </div>
      </div>
      <p><strong>Department:</strong> {user?.department || "Not set"}</p>
      <Badge>{user?.role || "student"}</Badge>
    </section>
  );
}
