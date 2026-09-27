import { Check, Loader2, Pencil, RefreshCcw, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Remaining from "@/features/tickets/components/sla/Remaining";
import { useProgress } from "@/features/tickets/hooks/useProgress";
import { useTicketReassign } from "@/features/tickets/hooks/useTicketReassign";
import {
  approveTicket,
  rejectTicket,
  reopenTicket,
  resolveTicket,
} from "@/features/tickets/services/ticketApi";
import { formatTicketDate } from "@/lib/utils";

export default function ControlPanel({ ticket, onRefresh }) {
  const [loadingAction, setLoadingAction] = useState(null);
  const { isAdmin, isSupervisor } = useAuth();

  const {
    isEditingAssignee,
    setIsEditingAssignee,
    agentSearch,
    setAgentSearch,
    agents,
    loadingAgents,
    submittingAssign,
    assignedName,
    handleReassign,
  } = useTicketReassign(ticket, onRefresh);

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

  const handleResolve = async () => {
    if (loadingAction) return;
    try {
      setLoadingAction("RESOLVE");
      await resolveTicket(ticket.id);
      toast.success("Ticket resuelto con éxito");
      if (onRefresh) await onRefresh();
    } catch (error) {
      toast.error("Error al resolver el ticket: " + error.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReopen = async () => {
    if (loadingAction) return;
    try {
      setLoadingAction("REOPEN");
      await reopenTicket(ticket.id);
      toast.success("Ticket reabierto con éxito");
      if (onRefresh) await onRefresh();
    } catch (error) {
      toast.error("Error al reabrir el ticket: " + error.message);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-card border-border order-3 h-fit self-start rounded-lg border p-4 shadow-md lg:col-span-2 lg:col-start-4 lg:row-start-2 2xl:col-span-1 2xl:col-start-4">
      <div className="border-border border-b text-sm font-semibold sm:text-lg">
        Panel de Control & SLA
      </div>

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
        {/* Sección de Asignación */}
        <div className="border-border mb-2 border-b pb-2">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground/70 text-xs sm:text-sm">
              Asignado A:
            </p>
            {!isEditingAssignee ? (
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold sm:text-sm">
                  {assignedName ? assignedName : "No asignado"}
                </p>
                {(isAdmin || isSupervisor) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground h-6 w-6 cursor-pointer p-0"
                    onClick={() => setIsEditingAssignee(true)}
                    title="Reasignar empleado"
                  >
                    <Pencil size="12" />
                  </Button>
                )}
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive/80 h-6 w-6 cursor-pointer p-0"
                onClick={() => setIsEditingAssignee(false)}
                title="Cancelar reasignación"
              >
                <X size="14" />
              </Button>
            )}
          </div>

          {isEditingAssignee && (
            <div className="mt-2 space-y-2">
              <input
                type="text"
                placeholder="Buscar empleado por nombre o email..."
                value={agentSearch}
                onChange={(e) => setAgentSearch(e.target.value)}
                className="bg-background border-border focus:ring-primary w-full rounded-md border px-2 py-1 text-xs outline-none focus:ring-1"
              />
              <div className="border-border bg-background max-h-36 space-y-1 overflow-y-auto rounded-md border p-1">
                {loadingAgents ? (
                  <div className="flex justify-center py-2">
                    <Loader2
                      size="14"
                      className="text-muted-foreground animate-spin"
                    />
                  </div>
                ) : agents.length > 0 ? (
                  agents.map((agent) => (
                    <div
                      key={agent.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleReassign(agent)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleReassign(agent);
                        }
                      }}
                      className="hover:bg-muted focus:bg-muted flex cursor-pointer items-center justify-between rounded px-2 py-1.5 text-xs transition-colors outline-none"
                    >
                      <span className="font-medium">{agent.name}</span>
                      {submittingAssign && (
                        <Loader2 size="12" className="animate-spin" />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground py-2 text-center text-xs">
                    No se encontraron agentes
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Fila: Aprobación */}
        <div className="border-border mb-2 flex items-center justify-between border-b pb-2">
          <p className="text-muted-foreground/70 text-xs sm:text-sm">
            Aprobación:
          </p>

          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold sm:text-sm">
              {ticket.requiresApproval
                ? ticket.status === "PENDING_APPROVAL"
                  ? "Pendiente"
                  : ticket.status === "CLOSED"
                    ? "Rechazado"
                    : "Aprobado"
                : "No Requiere"}
            </p>

            {ticket.requiresApproval &&
              ticket.status === "PENDING_APPROVAL" && isAdmin && (
              <div className="flex items-center gap-1.5">
                <Button
                  disabled={Boolean(loadingAction)}
                  className="bg-success text-primary-foreground hover:bg-success/80 h-6 w-6 cursor-pointer rounded-md p-0 transition-colors"
                  onClick={handleApprove}
                  title="Aprobar"
                >
                  {loadingAction === "APPROVE" ? (
                    <Loader2 size="12" className="animate-spin" />
                  ) : (
                    <Check size="12" />
                  )}
                </Button>
                <Button
                  disabled={Boolean(loadingAction)}
                  className="bg-destructive text-primary-foreground hover:bg-destructive/80 h-6 w-6 cursor-pointer rounded-md p-0 transition-colors"
                  onClick={handleReject}
                  title="Rechazar"
                >
                  {loadingAction === "REJECT" ? (
                    <Loader2 size="12" className="animate-spin" />
                  ) : (
                    <X size="12" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Fila: Creado */}
        <div className="border-border mb-2 flex justify-between border-b pb-2">
          <p className="text-muted-foreground/70 text-xs sm:text-sm">Creado:</p>
          <p className="text-xs font-semibold sm:text-sm">
            {formatTicketDate(ticket.createdAt)}
          </p>
        </div>
      </div>

      {/* Botones de acción inferior con estados de carga (Spinners dinámicos) */}
      {ticket.status !== "PENDING_APPROVAL" &&
        (ticket.status !== "CLOSED" ? (
          <Button
            disabled={Boolean(loadingAction)}
            className="bg-success hover:bg-success/80 w-full cursor-pointer py-4 disabled:opacity-50"
            onClick={handleResolve}
          >
            {loadingAction === "RESOLVE" ? (
              <>
                <Loader2 size="14" className="mr-2 animate-spin" />
                Resolviendo...
              </>
            ) : (
              <>
                <Check size="14" className="mr-2" />
                Marcar como Resuelta
              </>
            )}
          </Button>
        ) : (
          (isAdmin || isSupervisor) && (
            <Button
              disabled={Boolean(loadingAction)}
              className="bg-destructive hover:bg-destructive/80 w-full cursor-pointer py-4 disabled:opacity-50"
              onClick={handleReopen}
            >
              {loadingAction === "REOPEN" ? (
                <>
                  <Loader2 size="14" className="mr-2 animate-spin" />
                  Reabriendo...
                </>
              ) : (
                <>
                  <RefreshCcw size="14" className="mr-2" />
                  Volver a Abrir
                </>
              )}
            </Button>
          )
        ))}
    </div>
  );
}