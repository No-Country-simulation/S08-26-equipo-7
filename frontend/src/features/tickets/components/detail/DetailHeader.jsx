import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import StatusBadge from "../badges/StatusBadge";

export default function DetailHeader({ ticket }) {
  const location = useLocation();
  const navigate = useNavigate();

  const fromPath = location.state?.from || "/";

  return (
    <div className="bg-card border-border order-1 flex flex-wrap items-center justify-between rounded-lg border p-4 shadow-md lg:col-span-5 2xl:col-span-4">
      <Button
        variant="ghost"
        onClick={() => navigate(fromPath)}
        className="text-secondary-foreground cursor-pointer text-xs sm:text-sm"
      >
        <ArrowLeft className="size-4 sm:size-5" />
        Volver
      </Button>
      <div>
        <StatusBadge
          className="mr-2 text-xs sm:text-sm"
          status={ticket.codigo}
        />
        <StatusBadge
          className="text-xs sm:text-sm"
          status={ticket.grupoEstado}
        />
      </div>
    </div>
  );
}