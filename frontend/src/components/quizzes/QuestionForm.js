"use client";

import { useState } from "react";
import { quizApi } from "@/utils/api/quizApi";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { Field, Input, Select, Textarea } from "@/components/shared/Input";
import { errorMessage } from "@/utils/formatters";

export default function QuestionForm({ courseId, quizId, onSaved }) {
  const [values, setValues] = useState({ text: "", type: "multiple_choice", options: "", correctAnswer: "", points: 1 });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const payload = { ...values, options: values.options.split("\n").filter(Boolean) };
    try {
      await quizApi.addQuestion(quizId, payload);
      setValues({ text: "", type: "multiple_choice", options: "", correctAnswer: "", points: 1 });
      onSaved?.();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <h3>Add question</h3>
      <ErrorMessage message={error} />
      <Field label="Question"><Textarea required value={values.text} onChange={(e) => setValues({ ...values, text: e.target.value })} /></Field>
      <Field label="Type">
        <Select value={values.type} onChange={(e) => setValues({ ...values, type: e.target.value })}>
          <option value="multiple_choice">Multiple choice</option>
          <option value="true_false">True or false</option>
          <option value="short_answer">Short answer</option>
        </Select>
      </Field>
      <Field label="Options, one per line"><Textarea value={values.options} onChange={(e) => setValues({ ...values, options: e.target.value })} /></Field>
      <div className="form-grid two">
        <Field label="Correct answer"><Input value={values.correctAnswer} onChange={(e) => setValues({ ...values, correctAnswer: e.target.value })} /></Field>
        <Field label="Points"><Input type="number" min="1" value={values.points} onChange={(e) => setValues({ ...values, points: Number(e.target.value) })} /></Field>
      </div>
      <button className="btn" type="submit">Add question</button>
    </form>
  );
}
