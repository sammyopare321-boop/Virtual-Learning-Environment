"use client";

import { useState } from "react";
import CourseLayout from "@/layouts/CourseLayout";
import DiscussionThread from "@/components/communication/DiscussionThread";
import EmptyState from "@/components/shared/EmptyState";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { Field, Input, Textarea } from "@/components/shared/Input";
import { communicationApi } from "@/utils/api/communicationApi";
import { useFetch } from "@/hooks/useFetch";
import { errorMessage } from "@/utils/formatters";

export default function DiscussionsPage({ params }) {
  const discussions = useFetch(() => communicationApi.getDiscussions(params.courseId), [params.courseId]);
  const [values, setValues] = useState({ title: "", message: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    try {
      await communicationApi.startDiscussion(params.courseId, values);
      setValues({ title: "", message: "" });
      discussions.reload();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <CourseLayout courseId={params.courseId} title="Discussions">
      {discussions.loading && <Loader label="Loading discussions" />}
      <ErrorMessage message={discussions.error || error} />
      <form className="form-card form-grid" onSubmit={submit} style={{ marginBottom: 18 }}>
        <h2>Start discussion</h2>
        <Field label="Title"><Input value={values.title} required onChange={(e) => setValues({ ...values, title: e.target.value })} /></Field>
        <Field label="Message"><Textarea value={values.message} required onChange={(e) => setValues({ ...values, message: e.target.value })} /></Field>
        <button className="btn" type="submit">Post discussion</button>
      </form>
      {discussions.data?.length ? <div className="card-grid">{discussions.data.map((item) => <DiscussionThread key={item._id} discussion={item} courseId={params.courseId} />)}</div> : !discussions.loading && <EmptyState title="No discussions yet" />}
    </CourseLayout>
  );
}
