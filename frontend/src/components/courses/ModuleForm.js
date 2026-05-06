"use client";

import { useState } from "react";
import { moduleApi } from "@/utils/api/moduleApi";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { Field, Input, Textarea } from "@/components/shared/Input";
import { errorMessage } from "@/utils/formatters";

export default function ModuleForm({ courseId, onSaved }) {
  const [values, setValues] = useState({ title: "", description: "", order: 1 });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await moduleApi.create(courseId, values);
      setValues({ title: "", description: "", order: 1 });
      onSaved?.();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <h2>Add module</h2>
      <ErrorMessage message={error} />
      <Field label="Title"><Input required value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })} /></Field>
      <Field label="Description"><Textarea value={values.description} onChange={(e) => setValues({ ...values, description: e.target.value })} /></Field>
      <Field label="Order"><Input type="number" min="1" value={values.order} onChange={(e) => setValues({ ...values, order: Number(e.target.value) })} /></Field>
      <button className="btn" type="submit">Add module</button>
    </form>
  );
}
