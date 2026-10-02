// Importamos únicamente la vista principal de la feature
import DetailView from "@/features/tickets/components/detail/DetailView";

export default function TicketDetailPage() {
  return (
    <div className="mx-auto w-4/5 space-y-4">
      <DetailView />
    </div>
  );
}