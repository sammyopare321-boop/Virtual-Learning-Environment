"use client";

import { useState } from "react";
import { liveApi } from "@/utils/api/liveApi";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { Field, Input, Textarea } from "@/components/shared/Input";
import { errorMessage } from "@/utils/formatters";

export default function LiveSessionForm({ courseId, onSaved }) {
  const [values, setValues] = useState({ title: "", description: "", startTime: "", roomUrl: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    try {
      await liveApi.create(courseId, values);
      setValues({ title: "", description: "", startTime: "", roomUrl: "" });
      onSaved?.();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <h2>Schedule live session</h2>
      <ErrorMessage message={error} />
      <Field label="Title"><Input value={values.title} required onChange={(e) => setValues({ ...values, title: e.target.value })} /></Field>
      <Field label="Description"><Textarea value={values.description} onChange={(e) => setValues({ ...values, description: e.target.value })} /></Field>
      <Field label="Start time"><Input type="datetime-local" value={values.startTime} onChange={(e) => setValues({ ...values, startTime: e.target.value })} /></Field>
      <Field label="Room URL"><Input value={values.roomUrl} onChange={(e) => setValues({ ...values, roomUrl: e.target.value })} /></Field>
      <button className="btn" type="submit">Schedule session</button>
    </form>
  );
}
