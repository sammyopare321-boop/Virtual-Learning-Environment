"use client";

import { useState } from "react";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { Field, Input, Select, Textarea } from "@/components/shared/Input";
import { courseApi } from "@/utils/api/courseApi";
import { errorMessage } from "@/utils/formatters";

export default function CourseForm({ onSaved }) {
  const [values, setValues] = useState({
    title: "",
    code: "",
    description: "",
    semester: "",
    academicYear: "",
    status: "draft"
  });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await courseApi.create(values);
      setValues({ title: "", code: "", description: "", semester: "", academicYear: "", status: "draft" });
      onSaved?.();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <h2>Create course</h2>
      <ErrorMessage message={error} />
      <div className="form-grid two">
        <Field label="Course title"><Input required value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })} /></Field>
        <Field label="Course code"><Input required value={values.code} onChange={(e) => setValues({ ...values, code: e.target.value })} /></Field>
      </div>
      <Field label="Description"><Textarea required value={values.description} onChange={(e) => setValues({ ...values, description: e.target.value })} /></Field>
      <div className="form-grid two">
        <Field label="Semester"><Input required value={values.semester} onChange={(e) => setValues({ ...values, semester: e.target.value })} /></Field>
        <Field label="Academic year"><Input required value={values.academicYear} onChange={(e) => setValues({ ...values, academicYear: e.target.value })} /></Field>
      </div>
      <Field label="Status">
        <Select value={values.status} onChange={(e) => setValues({ ...values, status: e.target.value })}>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </Select>
      </Field>
      <button className="btn" type="submit">Create course</button>
    </form>
  );
}
