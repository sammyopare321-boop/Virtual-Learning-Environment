"use client";

import { useState } from "react";
import { liveApi } from "@/utils/api/liveApi";
import { errorMessage } from "@/utils/formatters";
import ErrorMessage from "@/components/shared/ErrorMessage";

export default function JoinButton({ courseId, session }) {
  const [error, setError] = useState("");

  const join = async () => {
    try {
      const response = await liveApi.join(courseId, session._id);
      const url = response.data?.data?.joinUrl || response.data?.data?.roomUrl || response.data?.joinUrl || session.roomUrl;
      if (url) window.location.href = url;
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div>
      <ErrorMessage message={error} />
      <button className="btn" type="button" onClick={join}>Join session</button>
    </div>
  );
}
