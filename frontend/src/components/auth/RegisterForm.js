"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { Field, Input } from "@/components/shared/Input";

export default function RegisterForm() {
  const { register } = useAuth();
  const [values, setValues] = useState({ name: "", email: "", password: "", department: "", role: "student" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await register(values);
    } catch (err) {
      const data = err?.response?.data;
      setError(data?.details?.[0] || data?.message || err.message || "Failed to register");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <ErrorMessage message={error} />
      <Field label="Full name">
        <Input value={values.name} required onChange={(e) => setValues({ ...values, name: e.target.value })} />
      </Field>
      <Field label="Email">
        <Input type="email" value={values.email} required onChange={(e) => setValues({ ...values, email: e.target.value })} />
      </Field>
      <Field label="Account Type">
        <select className="input" value={values.role} onChange={(e) => setValues({ ...values, role: e.target.value })}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </Field>
      <Field label="Department">
        <Input value={values.department} onChange={(e) => setValues({ ...values, department: e.target.value })} />
      </Field>
      <Field label="Password">
        <Input type="password" minLength={6} value={values.password} required onChange={(e) => setValues({ ...values, password: e.target.value })} />
      </Field>
      <button className="btn" type="submit" disabled={submitting}>{submitting ? "Creating account" : "Create account"}</button>
    </form>
  );
}
