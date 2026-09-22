import InfoBanner from "@/components/InfoBanner";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function DashboardGreeting() {
  const { user } = useAuth();
  return (
    <InfoBanner
      title={`¡Hola, ${user.nombre}! Bienvenido a ServiceFlow`}
      paragraph="Panorama operativo de solicitudes internas y cumplimiento corporativo de SLA."
    />
  );
}
