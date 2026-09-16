import TicketsTableManager from "@/components/table/TicketsTableManager";
import { useTickets } from "@/hooks/useTickets";

export default function TicketsTable({ filters}) {
  const { tickets, loading, error } = useTickets({ ...filters });
  return(
    <div className="py-4 bg-card rounded-lg my-4 border border-border shadow-md">
      <TicketsTableManager tickets={tickets} resume={false} />
      {loading && <p>Cargando...</p>}
      {error && <p>Error al cargar los tickets</p>}
    </div>
  );
};