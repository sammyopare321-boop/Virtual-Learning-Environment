"use client";

import { useState } from "react";
import { adminApi } from "@/utils/api/adminApi";
import { Field, Input } from "@/components/shared/Input";

export default function ReassignTeacherModal({ courseId, onSaved }) {
  const [teacherId, setTeacherId] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    await adminApi.reassignTeacher(courseId, teacherId);
    onSaved?.();
  };
  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <h3>Reassign teacher</h3>
      <Field label="Teacher ID"><Input value={teacherId} onChange={(e) => setTeacherId(e.target.value)} /></Field>
      <button className="btn" type="submit">Reassign</button>
    </form>
  );
}
