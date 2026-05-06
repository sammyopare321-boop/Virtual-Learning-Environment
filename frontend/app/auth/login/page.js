import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import AuthLayout from "@/layouts/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout title="Sign in to continue">
      <LoginForm />
      <p className="muted">New student? <Link href="/auth/register">Create an account</Link></p>
    </AuthLayout>
  );
}
