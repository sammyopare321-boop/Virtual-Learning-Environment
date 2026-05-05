"use client";

import CourseLayout from "@/layouts/CourseLayout";
import AnnouncementBanner from "@/components/communication/AnnouncementBanner";
import AnnouncementForm from "@/components/communication/AnnouncementForm";
import EmptyState from "@/components/shared/EmptyState";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { communicationApi } from "@/utils/api/communicationApi";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext";
import { canManageCourse } from "@/utils/roleGuard";

export default function AnnouncementsPage({ params }) {
  const { user } = useAuth();
  const announcements = useFetch(() => communicationApi.getAnnouncements(params.courseId), [params.courseId]);

  return (
    <CourseLayout courseId={params.courseId} title="Announcements">
      {announcements.loading && <Loader label="Loading announcements" />}
      <ErrorMessage message={announcements.error} />
      {canManageCourse(user) && <div style={{ marginBottom: 18 }}><AnnouncementForm courseId={params.courseId} onSaved={announcements.reload} /></div>}
      {announcements.data?.length ? <div className="form-grid">{announcements.data.map((item) => <AnnouncementBanner key={item._id} announcement={item} />)}</div> : !announcements.loading && <EmptyState title="No announcements yet" />}
    </CourseLayout>
  );
}
