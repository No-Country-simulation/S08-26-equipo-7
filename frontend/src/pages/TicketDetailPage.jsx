import { useParams } from "react-router-dom";

// Importamos los componentes puros de UI (tontos)
import DetailView from "@/features/tickets/components/detail/DetailView";
import { useTicketDetails } from "@/features/tickets/hooks/useTicketDetails";

export default function TicketDetailPage() {
  const { id } = useParams();
  const { ticket, loading, error } = useTicketDetails(id);

  if (loading) {
    return (
      <div className="mx-auto w-4/5 space-y-4">
        <DetailView loading />
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
