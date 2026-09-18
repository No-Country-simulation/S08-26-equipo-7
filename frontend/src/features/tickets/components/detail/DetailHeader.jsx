import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import StatusBadge from "../badges/StatusBadge";
export default function DetailHeader({ ticket }) {
  return (
    <div className="bg-card border-border order-1 flex flex-wrap items-center justify-between rounded-lg border p-4 shadow-md lg:col-span-5 2xl:col-span-4">
      <Link to="/tickets">
        <Button
          variant="ghost"
          className="text-secondary-foreground cursor-pointer"
        >
          <ArrowLeft />
          Volver al Listado
        </Button>
      </Link>
      <div>
        <StatusBadge className="mr-2" status={ticket.codigo} />
        <StatusBadge status={ticket.grupoEstado} />
      </div>
    </div>
  );
}
