"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { Field, Input } from "@/components/shared/Input";

export default function RegisterForm() {
  const { register, authError, setAuthError } = useAuth();
  const [values, setValues] = useState({ name: "", email: "", password: "", department: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(values);
    } catch (error) {
      setAuthError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <ErrorMessage message={authError} />
      <Field label="Full name">
        <Input value={values.name} required onChange={(e) => setValues({ ...values, name: e.target.value })} />
      </Field>
      <Field label="Email">
        <Input type="email" value={values.email} required onChange={(e) => setValues({ ...values, email: e.target.value })} />
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
