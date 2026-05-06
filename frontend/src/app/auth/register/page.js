import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";
import AuthLayout from "@/layouts/AuthLayout";

export default function RegisterPage() {
  return (
    <AuthLayout title="Create your student account">
      <RegisterForm />
      <p className="muted">Already registered? <Link href="/auth/login">Sign in</Link></p>
    </AuthLayout>
  );
}
