import { ArrowRight, CircleX, Inbox } from "lucide-react";
import { Link } from "react-router-dom";

import TableManager from "@/features/tickets/components/table/TableManager";
import TableSkeleton from "@/features/tickets/components/table/TableSkeleton";
import { useTickets } from "@/features/tickets/hooks/useTickets";

export default function RecentTicketsTable() {
  const { tickets, loading, error } = useTickets({ limit: 5 });
  return (
    <div className="bg-card border-border my-4 rounded-lg border py-4 shadow-md">
      <div className="my-2 flex w-full items-center justify-between px-4">
        <h2 className="text-sm font-bold md:text-lg">Solicitudes Recientes</h2>
        <Link to="/tickets" className="text-primary text-xs md:text-sm">
          <div className="flex items-center gap-2">
            Ver todas
            <ArrowRight className="size-4 md:size-5" />
          </div>
        </Link>
      </div>
      {loading && tickets.length === 0 && <TableSkeleton mobile />}
      {error && tickets.length === 0 && (
        <div
          className="text-muted-foreground flex flex-col items-center justify-center py-4 text-center"
          role="status"
        >
          <CircleX className="text-destructive mb-4 size-10" />
          <p className="text-destructive p-6 text-center" role="alert">
            No se pudieron cargar las solicitudes recientes.
          </p>
        </div>
      )}
      {!loading && !error && tickets.length === 0 && (
        <div
          className="text-muted-foreground flex flex-col items-center justify-center py-4 text-center"
          role="status"
        >
          <div className="bg-foreground/10 mb-4 flex h-16 w-16 items-center justify-center rounded-lg">
            <Inbox className="size-10" />
          </div>
          <p className="text-2xl font-bold">Resultados no encontrados</p>
          <p className="text-xs">Todavia no hay solicitudes recientes.</p>
        </div>
      )}
      {tickets.length > 0 && <TableManager tickets={tickets} />}
    </div>
  );
}
