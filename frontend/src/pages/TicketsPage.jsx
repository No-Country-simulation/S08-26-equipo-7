import InfoBanner from "@/components/InfoBanner";
import Filters from "@/features/tickets/components/filters/Filters";
import Table from "@/features/tickets/components/table/Table";
import TicketListProvider from "@/features/tickets/context/TicketListContext";

const DEFAULT_TICKET_FILTERS = {
  search: "",
  category: "",
  group: "",
  priority: "",
};

function TicketsPageContent() {
  return (
    <div className="mx-auto w-4/5 space-y-4">
      <InfoBanner
        title="Listado Centralizado de Solicitudes"
        paragraph="Filtre, examine y supervise cada requerimiento interno de la compañía."
      />
      <Filters />
      <Table />
    </div>
  );
}

export default function TicketsPage() {
  return (
    <TicketListProvider initialFilters={DEFAULT_TICKET_FILTERS}>
      <TicketsPageContent />
    </TicketListProvider>
  );
}
