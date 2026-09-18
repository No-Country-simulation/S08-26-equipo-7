import { useParams } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";
// Importamos los componentes puros de UI (tontos)
import DetailView from "@/features/tickets/components/detail/DetailView";
import { useTicketDetails } from "@/features/tickets/hooks/useTicketDetails";

export default function TicketDetailPage() {
  const { id } = useParams();
  const { ticket, loading, error } = useTicketDetails(id);

  // El orquestador decide qué estado renderizar
  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (!ticket) {
    return <div className="p-6">Ticket no encontrado.</div>;
  }

  return (
    <div className="mx-auto w-4/5 space-y-4">
      <DetailView ticket={ticket} />
    </div>
  );
}
