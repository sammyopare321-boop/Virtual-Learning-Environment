"use client";

import { useAuth } from "@/context/AuthContext";
import ProfileCard from "@/components/auth/ProfileCard";
import ProfileEditForm from "@/components/auth/ProfileEditForm";
import Loader from "@/components/shared/Loader";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  if (loading) return <Loader label="Loading profile" />;

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Profile</h1>
        </div>
      </div>
      <div className="two-column">
        <ProfileCard user={user} />
        <ProfileEditForm user={user} />
      </div>
    </section>
  );
}
