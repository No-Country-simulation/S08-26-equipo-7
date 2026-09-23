import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import ControlPanelSkeleton from "@/features/skeleton/ControlPanelSkeleton";
import Remaining from "@/features/tickets/components/sla/Remaining";
import { useProgress } from "@/features/tickets/hooks/useProgress";
import {
  approveTicket,
  rejectTicket,
} from "@/features/tickets/services/ticketApi";
import { formatTicketDate } from "@/lib/utils";

export default function ControlPanel({ ticket, options = [], loadingOptions = false, onRefresh }) {
  const [valueOption, setValueOption] = useState(ticket.grupoEstado);
  const [loadingAction, setLoadingAction] = useState(null);

  const isResolved =
    ticket.resolvedAt !== null &&
    ticket.resolvedAt !== undefined &&
    String(ticket.resolvedAt).trim() !== "";

  const progress = useProgress(
    ticket.createdAt,
    ticket.slaDueAt,
    ticket.resolvedAt,
  );

  const handleApprove = async () => {
    if (loadingAction) return;
    try {
      setLoadingAction("APPROVE");
      await approveTicket(ticket.id);
      toast.success("Ticket aprobado con éxito");
      if (onRefresh) await onRefresh();
    } catch (error) {
      toast.error("Error al aprobar el ticket: " + error.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async () => {
    if (loadingAction) return;
    try {
      setLoadingAction("REJECT");
      await rejectTicket(ticket.id);
      toast.success("Ticket rechazado con éxito");
      if (onRefresh) await onRefresh();
    } catch (error) {
      toast.error("Error al rechazar el ticket: " + error.message);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-card border-border order-3 h-fit self-start rounded-lg border p-4 shadow-md lg:col-span-2 lg:col-start-4 lg:row-start-2 2xl:col-span-1 2xl:col-start-4">
      <div className="border-border border-b text-sm font-semibold sm:text-lg">
        Panel de Control & SLA
      </div>
      <p className="text-muted-foreground/70 mt-4 mb-2 text-xs font-semibold sm:text-sm">
        Estado de atención
      </p>
      {loadingOptions ? (
        <ControlPanelSkeleton />
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
      <div className="bg-ring mt-4 rounded-lg p-4">
        <div className="mb-2 flex justify-between">
          <p className="text-muted-foreground text-xs sm:text-sm">
            Progreso del SLA
          </p>
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
        <div className="border-border mb-2 flex justify-between border-b pb-2">
          <p className="text-muted-foreground/70 text-xs sm:text-sm">
            Agente Asignado:
          </p>
          <p className="text-xs font-semibold sm:text-sm">
            {ticket.assignedToName ? ticket.assignedToName : "No asignado"}
          </p>
        </div>
        <div className="border-border mb-2 flex justify-between border-b pb-2">
          <p className="text-muted-foreground/70 text-xs sm:text-sm">
            Requiere Aprovación:
          </p>
          <p className="text-xs font-semibold sm:text-sm">
            {ticket.requiresApproval ? (ticket.status === "PENDING_APPROVAL" ? "Sí" : "Aprobado") : "No"}
          </p>
        </div>
        <div className="border-border mb-2 flex justify-between border-b pb-2">
          <p className="text-muted-foreground/70 text-xs sm:text-sm">
            Fecha de Creación:
          </p>
          <p className="text-xs font-semibold sm:text-sm">
            {formatTicketDate(ticket.createdAt)}
          </p>
        </div>
      </div>
      {ticket.requiresApproval && ticket.status !== "APPROVED" && (
        <div className="mb-2 pb-2">
          <p className="text-muted-foreground/70 text-xs font-semibold sm:text-sm">
            Aprovar Solicitud?
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <Button
              disabled={Boolean(loadingAction)}
              className="bg-success text-primary-foreground flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-xs font-semibold sm:text-sm hover:bg-success/80 disabled:opacity-50"
              onClick={handleApprove}
            >
              {loadingAction === "APPROVE" ? (
                <Loader2 size="14" className="mr-2 animate-spin" />
              ) : (
                <Check size="14" className="mr-2" />
              )}
              Aprobar
            </Button>
            <Button
              disabled={Boolean(loadingAction)}
              className="bg-destructive text-primary-foreground flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-xs font-semibold sm:text-sm hover:bg-destructive/80 disabled:opacity-50"
              onClick={handleReject}
            >
              {loadingAction === "REJECT" ? (
                <Loader2 size="16" className="mr-2 animate-spin" />
              ) : (
                <X size="16" className="mr-2" />
              )}
              Rechazar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}