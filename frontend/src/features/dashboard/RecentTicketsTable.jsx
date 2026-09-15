import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import TicketsTableManager from "@/features/tickets/components/TicketsTableManager";

export default function RecentTicketsTable() {
  return (
    <div className="py-4 bg-card rounded-lg my-4 border border-border shadow-md">
      <div className="w-full flex justify-between items-center px-4 my-2">
        <h1 className="text-sm md:text-lg font-bold">Solicitudes Recientes</h1>
        <Link to="/tickets" className="text-primary text-xs md:text-sm">
          <div className="flex items-center gap-2">
              Ver todas
            <ArrowRight className="size-4 md:size-5" />
          </div>
        </Link>
      </div>
      <TicketsTableManager limit={5} offset={0} />
    </div>
  );
}