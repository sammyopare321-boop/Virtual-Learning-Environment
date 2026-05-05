"use client";

import { useState } from "react";
import { quizApi } from "@/utils/api/quizApi";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { Field, Input } from "@/components/shared/Input";
import { errorMessage } from "@/utils/formatters";

export default function QuizAttemptForm({ courseId, quizId, questions = [] }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    try {
      const payload = { answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })) };
      const response = await quizApi.submit(courseId, quizId, payload);
      setResult(response.data?.data || response.data);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <h2>Quiz attempt</h2>
      <ErrorMessage message={error} />
      {questions.map((question) => (
        <Field key={question._id} label={question.text || question.question}>
          <Input value={answers[question._id] || ""} onChange={(e) => setAnswers({ ...answers, [question._id]: e.target.value })} />
        </Field>
      ))}
      <button className="btn" type="submit">Submit quiz</button>
      {result && <div className="notice">Quiz submitted. Score: {result.score ?? result.percentage ?? "Pending review"}</div>}
    </form>
  );
}
