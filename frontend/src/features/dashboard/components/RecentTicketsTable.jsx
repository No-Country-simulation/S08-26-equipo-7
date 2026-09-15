import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import TicketsTable from "@/features/tickets/components/TicketsTable";

export default function RecentTicketsTable() {
  return (
    <div className="py-4 bg-card rounded-lg my-4 border border-border shadow-md">
      <div className="w-full flex justify-between items-center px-4 my-2">
        <h1 className="text-lg font-bold">Solicitudes Recientes</h1>
        <Link to="/tickets" className="text-primary">
          <div className="flex items-center gap-2">
              Ver todas
            <ArrowRight />
          </div>
        </Link>
      </div>
      <TicketsTable limit={5} offset={0} />
    </div>
  );
}