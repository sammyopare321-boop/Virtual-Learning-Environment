"use client";

import CourseLayout from "@/layouts/CourseLayout";
import DiscussionThread from "@/components/communication/DiscussionThread";
import DiscussionReplyForm from "@/components/communication/DiscussionReplyForm";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { communicationApi } from "@/utils/api/communicationApi";
import { useFetch } from "@/hooks/useFetch";

export default function DiscussionDetailPage({ params }) {
  const discussion = useFetch(() => communicationApi.getDiscussion(params.courseId, params.discussionId), [params.courseId, params.discussionId]);
  const replies = discussion.data?.replies || [];

  return (
    <CourseLayout courseId={params.courseId} title={discussion.data?.title || "Discussion"}>
      {discussion.loading && <Loader label="Loading discussion" />}
      <ErrorMessage message={discussion.error} />
      {discussion.data && <DiscussionThread discussion={discussion.data} />}
      <div className="form-grid" style={{ marginTop: 18 }}>
        {replies.map((reply) => <DiscussionThread key={reply._id || reply.createdAt} discussion={reply} />)}
      </div>
      <div style={{ marginTop: 18 }}>
        <DiscussionReplyForm courseId={params.courseId} discussionId={params.discussionId} onSaved={discussion.reload} />
      </div>
    </CourseLayout>
  );
}
