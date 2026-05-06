"use client";

import { useState } from "react";
import { gradeApi } from "@/utils/api/gradeApi";
import { Field, Input } from "@/components/shared/Input";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { errorMessage } from "@/utils/formatters";

export default function GradeWeightForm({ courseId, onSaved }) {
  const [values, setValues] = useState({ assignmentWeight: 60, quizWeight: 40 });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    try {
      await gradeApi.setWeights(courseId, values);
      onSaved?.();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <h2>Grade weights</h2>
      <ErrorMessage message={error} />
      <Field label="Assignment weight"><Input type="number" value={values.assignmentWeight} onChange={(e) => setValues({ ...values, assignmentWeight: Number(e.target.value) })} /></Field>
      <Field label="Quiz weight"><Input type="number" value={values.quizWeight} onChange={(e) => setValues({ ...values, quizWeight: Number(e.target.value) })} /></Field>
      <button className="btn" type="submit">Save weights</button>
    </form>
  );
}
