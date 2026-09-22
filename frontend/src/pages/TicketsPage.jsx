import { useState } from "react";

import InfoBanner from "@/components/InfoBanner";
import Filters from "@/features/tickets/components/filters/Filters";
import Table from "@/features/tickets/components/table/Table";

export default function TicketsPage() {
  const [offsetPage, setOffsetPage] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    group: "",
    priority: "",
  });

  const handleFilterChange = (key, value) => {
    setOffsetPage(0);
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  return (
    <div className="mx-auto w-4/5 space-y-4">
      <InfoBanner
        title="Listado Centralizado de Solicitudes"
        paragraph="Filtre, examine y supervise cada requerimiento interno de la compañía."
      />
      <Filters filters={filters} onFilterChange={handleFilterChange} />
      <Table
        filters={filters}
        offset={offsetPage}
        onOffsetChange={setOffsetPage}
      />
    </div>
  );
}
