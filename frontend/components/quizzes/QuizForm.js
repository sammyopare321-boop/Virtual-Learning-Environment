"use client";

import { useState } from "react";
import { quizApi } from "@/utils/api/quizApi";
import { Field, Input, Textarea } from "@/components/shared/Input";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { errorMessage } from "@/utils/formatters";

export default function QuizForm({ courseId, onSaved }) {
  const [values, setValues] = useState({ title: "", description: "", duration: 30 });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    try {
      await quizApi.create(courseId, values);
      setValues({ title: "", description: "", duration: 30 });
      onSaved?.();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <h2>Create quiz</h2>
      <ErrorMessage message={error} />
      <Field label="Title"><Input required value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })} /></Field>
      <Field label="Description"><Textarea value={values.description} onChange={(e) => setValues({ ...values, description: e.target.value })} /></Field>
      <Field label="Duration in minutes"><Input type="number" min="1" value={values.duration} onChange={(e) => setValues({ ...values, duration: Number(e.target.value) })} /></Field>
      <button className="btn" type="submit">Create quiz</button>
    </form>
  );
}
