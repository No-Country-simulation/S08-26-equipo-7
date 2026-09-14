import ForgotPassForm from "@/features/auth/components/ForgotPassForm";
import AuthLayout from "@/layout/AuthLayout";

export default function ForgotPassPage() {
  return (
    <AuthLayout subtitle="Recuperación de acceso seguro.">
      <ForgotPassForm />
    </AuthLayout>
  );
}
