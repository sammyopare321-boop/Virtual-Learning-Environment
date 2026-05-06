"use client";

import { useState } from "react";
import { courseApi } from "@/utils/api/courseApi";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { errorMessage } from "@/utils/formatters";

export default function EnrollButton({ courseId }) {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const enroll = async () => {
    setError("");
    try {
      await courseApi.enroll(courseId);
      setStatus("Enrollment submitted.");
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div>
      <ErrorMessage message={error} />
      {status && <div className="notice">{status}</div>}
      <button className="btn" type="button" onClick={enroll}>Enroll in course</button>
    </div>
  );
}
