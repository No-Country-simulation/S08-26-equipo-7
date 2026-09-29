import InfoBanner from "@/components/InfoBanner";
import Approvals from "@/features/tickets/components/approvals/Approvals";
export default function ApprovalsPage() {
  return (
    <div className="mx-auto w-4/5 space-y-4">
      <InfoBanner
        title="Bandeja de aprobaciones gerenciales"
        paragraph="Las siguientes solicitudes requieren autorización explicita para continuar su flujo operativo."
      />
      <Approvals />
    </div>
  );
}