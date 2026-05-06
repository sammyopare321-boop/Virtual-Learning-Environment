"use client";

import { useState } from "react";
import { assignmentApi } from "@/utils/api/assignmentApi";
import ErrorMessage from "@/components/shared/ErrorMessage";
import FileUploader from "@/components/shared/FileUploader";
import { Field, Textarea } from "@/components/shared/Input";
import { errorMessage } from "@/utils/formatters";

export default function SubmissionForm({ assignmentId, onSaved }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("text", text);
    Array.from(files).forEach((file) => formData.append("files", file));
    try {
      await assignmentApi.submit(assignmentId, formData);
      setStatus("Submission uploaded.");
      setText("");
      onSaved?.();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <h2>Submit assignment</h2>
      <ErrorMessage message={error} />
      {status && <div className="notice">{status}</div>}
      <Field label="Submission text"><Textarea value={text} onChange={(e) => setText(e.target.value)} /></Field>
      <Field label="Files"><FileUploader onChange={(e) => setFiles(e.target.files || [])} /></Field>
      <button className="btn" type="submit">Submit work</button>
    </form>
  );
}
