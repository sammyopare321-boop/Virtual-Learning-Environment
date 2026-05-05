"use client";

import { useState } from "react";
import api from "@/utils/axiosInstance";
import { Field, Input, Textarea } from "@/components/shared/Input";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { errorMessage } from "@/utils/formatters";

export default function GradeForm({ submissionId, onSaved }) {
  const [values, setValues] = useState({ score: "", feedback: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.patch(`/api/submissions/${submissionId}/grade`, values);
      onSaved?.();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <h3>Grade submission</h3>
      <ErrorMessage message={error} />
      <Field label="Score"><Input type="number" value={values.score} onChange={(e) => setValues({ ...values, score: e.target.value })} /></Field>
      <Field label="Feedback"><Textarea value={values.feedback} onChange={(e) => setValues({ ...values, feedback: e.target.value })} /></Field>
      <button className="btn" type="submit">Save grade</button>
    </form>
  );
}
