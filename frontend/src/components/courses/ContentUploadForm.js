"use client";

import { useState } from "react";
import { moduleApi } from "@/utils/api/moduleApi";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { Field, Input } from "@/components/shared/Input";
import FileUploader from "@/components/shared/FileUploader";
import { errorMessage } from "@/utils/formatters";

export default function ContentUploadForm({ moduleId, onSaved }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    if (!moduleId) return;
    const formData = new FormData();
    formData.append("title", title);
    if (file) formData.append("file", file);
    try {
      await moduleApi.addContent(moduleId, formData);
      setTitle("");
      setFile(null);
      onSaved?.();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <h3>Upload content</h3>
      <ErrorMessage message={error} />
      <Field label="Title"><Input value={title} required onChange={(e) => setTitle(e.target.value)} /></Field>
      <Field label="File"><FileUploader multiple={false} onChange={(e) => setFile(e.target.files?.[0])} /></Field>
      <button className="btn" type="submit">Upload</button>
    </form>
  );
}
