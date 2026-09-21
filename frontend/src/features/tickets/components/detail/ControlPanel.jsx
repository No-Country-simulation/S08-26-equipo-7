import { useEffect, useState } from "react";

import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Remaining from "@/features/tickets/components/sla/Remaining";
import { useProgress } from "@/features/tickets/hooks/useProgress";
import { getStatus } from "@/features/tickets/services/statusApi";
import { formatTicketDate } from "@/lib/utils";


async function fetchStatus() {
  const status = await getStatus();
  return status;
}

export default function ControlPanel({ ticket }) {
  const [options, setOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [valueOption, setValueOption] = useState(ticket.grupoEstado);
  useEffect(() => {
    fetchStatus()
      .then(setOptions)
      .finally(() => setLoadingOptions(false));
  }, []);
  const isResolved =
    ticket.resolvedAt !== null &&
    ticket.resolvedAt !== undefined &&
    String(ticket.resolvedAt).trim() !== "";
  const progress = useProgress(
    ticket.createdAt,
    ticket.slaDueAt,
    ticket.resolvedAt,
  );
  return (
    <div className="bg-card border-border order-3 h-fit self-start rounded-lg border p-4 shadow-md lg:col-span-2 lg:col-start-4 lg:row-start-2 2xl:col-span-1 2xl:col-start-4">
      <div className="border-border border-b text-sm sm:text-lg font-semibold">
        Panel de Control & SLA
      </div>
      <p className="text-muted-foreground/70 font-semibold mt-4 mb-2 text-xs sm:text-sm">
        Estado de atención
      </p>
      {loadingOptions ? (
        <div
          className="border-border flex h-12 w-full items-center rounded-md border p-4"
          role="status"
          aria-label="Cargando estados"
        >
          <span className="sr-only">Cargando estados...</span>
          <Skeleton className="bg-muted-foreground/10 h-4 w-36" />
        </div>
      ) : (
        <Select
          value={valueOption}
          onValueChange={(value) => setValueOption(value)}
        >
          <SelectTrigger className="border-border w-full border p-2 sm:p-4">
            <SelectValue placeholder="Seleccione un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Estado de atención</SelectLabel>
              {options.map((option) => (
                <SelectItem key={option.name} value={option.name}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
      <div className="mt-4 bg-ring p-4 rounded-lg">
        <div className="mb-2 flex justify-between">
          <p className="text-muted-foreground text-xs sm:text-sm">Progreso del SLA</p>
          <p className="text-xs sm:text-sm">
            <Remaining slaDueAt={ticket.slaDueAt} status={ticket.status} />
          </p>
        </div>
        <Progress
          value={progress}
          indicatorClassName={isResolved ? "bg-success" : undefined}
          className="bg-foreground/15 h-2 w-full"
        />
      </div>
      <div className="mt-4">
        <div className="flex justify-between border-b border-border pb-2 mb-2">
          <p className="text-muted-foreground/70 text-xs sm:text-sm">Agente Asignado:</p>
          <p className="text-xs sm:text-sm font-semibold">
            {ticket.assignedAgent ? ticket.assignedAgent : "No asignado"}
          </p>
        </div>
        <div className="flex justify-between border-b border-border pb-2 mb-2">
          <p className="text-muted-foreground/70 text-xs sm:text-sm">Requiere Aprovación:</p>
          <p className="text-xs sm:text-sm font-semibold">
            {ticket.requiresApproval ? "Sí" : "No"}
          </p>
        </div>
        <div className="flex justify-between border-b border-border pb-2 mb-2">
          <p className="text-muted-foreground/70 text-xs sm:text-sm">Fecha de Creación:</p>
          <p className="text-xs sm:text-sm font-semibold">
            {formatTicketDate(ticket.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
