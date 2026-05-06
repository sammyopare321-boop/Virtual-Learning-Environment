"use client";

import { useState } from "react";
import { communicationApi } from "@/utils/api/communicationApi";
import { Field, Textarea } from "@/components/shared/Input";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { errorMessage } from "@/utils/formatters";

export default function DiscussionReplyForm({ courseId, discussionId, onSaved }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    try {
      await communicationApi.reply(courseId, discussionId, { message });
      setMessage("");
      onSaved?.();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <h3>Reply</h3>
      <ErrorMessage message={error} />
      <Field label="Message"><Textarea value={message} required onChange={(e) => setMessage(e.target.value)} /></Field>
      <button className="btn" type="submit">Post reply</button>
    </form>
  );
}
