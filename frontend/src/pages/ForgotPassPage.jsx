import AuthLayout from "@/layout/AuthLayout";
import ForgotPassForm from "@/features/auth/components/ForgotPassForm";

export default function ForgotPassPage() {
  return (
    <AuthLayout subtitle="Recuperación de acceso seguro.">
      <ForgotPassForm />
    </AuthLayout>
  );
}
