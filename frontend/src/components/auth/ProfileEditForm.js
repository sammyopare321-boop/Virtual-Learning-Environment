"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { Field, Input } from "@/components/shared/Input";
import { errorMessage } from "@/utils/formatters";

export default function ProfileEditForm({ user }) {
  const { updateProfile } = useAuth();
  const [values, setValues] = useState({ name: "", email: "", department: "" });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setValues({
      name: user?.name || "",
      email: user?.email || "",
      department: user?.department || ""
    });
  }, [user]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");
    try {
      await updateProfile(values);
      setStatus("Profile updated.");
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <h2>Edit profile</h2>
      <ErrorMessage message={error} />
      {status && <div className="notice">{status}</div>}
      <Field label="Full name">
        <Input value={values.name} required onChange={(e) => setValues({ ...values, name: e.target.value })} />
      </Field>
      <Field label="Email">
        <Input type="email" value={values.email} required onChange={(e) => setValues({ ...values, email: e.target.value })} />
      </Field>
      <Field label="Department">
        <Input value={values.department} onChange={(e) => setValues({ ...values, department: e.target.value })} />
      </Field>
      <button className="btn" type="submit">Save profile</button>
    </form>
  );
}
