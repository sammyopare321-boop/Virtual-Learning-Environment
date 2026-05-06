"use client";

import { useState } from "react";
import { assignmentApi } from "@/utils/api/assignmentApi";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { Field, Input, Textarea } from "@/components/shared/Input";
import { errorMessage } from "@/utils/formatters";

export default function AssignmentForm({ courseId, onSaved }) {
  const [values, setValues] = useState({ title: "", description: "", dueDate: "", points: 100 });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await assignmentApi.create(courseId, values);
      setValues({ title: "", description: "", dueDate: "", points: 100 });
      onSaved?.();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <h2>Create assignment</h2>
      <ErrorMessage message={error} />
      <Field label="Title"><Input required value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })} /></Field>
      <Field label="Description"><Textarea value={values.description} onChange={(e) => setValues({ ...values, description: e.target.value })} /></Field>
      <div className="form-grid two">
        <Field label="Due date"><Input type="datetime-local" value={values.dueDate} onChange={(e) => setValues({ ...values, dueDate: e.target.value })} /></Field>
        <Field label="Points"><Input type="number" min="1" value={values.points} onChange={(e) => setValues({ ...values, points: Number(e.target.value) })} /></Field>
      </div>
      <button className="btn" type="submit">Create assignment</button>
    </form>
  );
}
