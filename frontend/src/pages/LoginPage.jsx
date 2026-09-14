import LoginForm from "@/features/auth/components/LoginForm";
import AuthLayout from "@/layout/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout subtitle="Bienvenido de nuevo, organiza tu trabajo.">
      <LoginForm />
    </AuthLayout>
  );
}