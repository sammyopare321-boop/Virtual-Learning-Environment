"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { Field, Input } from "@/components/shared/Input";

export default function LoginForm() {
  const { login } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(values.email, values.password);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <ErrorMessage message={error} />
      <Field label="Email">
        <Input type="email" value={values.email} required onChange={(e) => setValues({ ...values, email: e.target.value })} />
      </Field>
      <Field label="Password">
        <Input type="password" value={values.password} required onChange={(e) => setValues({ ...values, password: e.target.value })} />
      </Field>
      <button className="btn" type="submit" disabled={submitting}>{submitting ? "Signing in" : "Sign in"}</button>
    </form>
  );
}
