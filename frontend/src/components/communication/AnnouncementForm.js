"use client";

import { useState } from "react";
import { communicationApi } from "@/utils/api/communicationApi";
import { Field, Input, Textarea } from "@/components/shared/Input";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { errorMessage } from "@/utils/formatters";

export default function AnnouncementForm({ courseId, onSaved }) {
  const [values, setValues] = useState({ title: "", message: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    try {
      await communicationApi.createAnnouncement(courseId, values);
      setValues({ title: "", message: "" });
      onSaved?.();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <h2>Post announcement</h2>
      <ErrorMessage message={error} />
      <Field label="Title"><Input value={values.title} required onChange={(e) => setValues({ ...values, title: e.target.value })} /></Field>
      <Field label="Message"><Textarea value={values.message} required onChange={(e) => setValues({ ...values, message: e.target.value })} /></Field>
      <button className="btn" type="submit">Post announcement</button>
    </form>
  );
}
