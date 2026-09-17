import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import TableManager from "@/features/tickets/components/table/TableManager";
import TableSkeleton from "@/features/tickets/components/table/TableSkeleton";
import { useTickets } from "@/features/tickets/hooks/useTickets";

export default function RecentTicketsTable() {
  const { tickets, loading, error } = useTickets({ limit: 5 });
  return (
    <div className="py-4 bg-card rounded-lg my-4 border border-border shadow-md">
      <div className="w-full flex justify-between items-center px-4 my-2">
        <h2 className="text-sm md:text-lg font-bold">Solicitudes Recientes</h2>
        <Link to="/tickets" className="text-primary text-xs md:text-sm">
          <div className="flex items-center gap-2">
              Ver todas
            <ArrowRight className="size-4 md:size-5" />
          </div>
        </Link>
      </div>
      {loading && <TableSkeleton mobile />}
      {error && (
        <p className="p-6 text-center text-destructive" role="alert">
          No se pudieron cargar las solicitudes recientes.
        </p>
      )}
      {!loading && !error && tickets.length === 0 && (
        <p className="p-6 text-center text-muted-foreground" role="status">
          Todavía no hay solicitudes recientes.
        </p>
      )}
      {!loading && !error && tickets.length > 0 && <TableManager tickets={tickets} />}
    </div>
  );
}