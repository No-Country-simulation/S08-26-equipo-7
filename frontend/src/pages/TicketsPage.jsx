import { useState } from "react";

import InfoBanner from "@/components/InfoBanner";
import TicketFilters from "@/features/tickets/components/TicketFilters";
import TicketsTable from "@/features/tickets/components/TicketsTable";

export default function TicketsPage() {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    priority: "",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  console.log(filters);
  return (
    <div className="space-y-4 w-4/5 mx-auto">
      <InfoBanner
        title="Listado Centralizado de Solicitudes"
        paragraph="Filtre, examine y supervise cada requerimiento interno de la compañía."
      />
      <TicketFilters filters={filters} onFilterChange={handleFilterChange} />
      <TicketsTable filters={filters} />
    </div>
  );
}