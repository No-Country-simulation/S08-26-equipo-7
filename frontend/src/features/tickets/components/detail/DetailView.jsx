import { FileQuestion, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import DetailViewSkeleton from "@/features/skeleton/DetailViewSkeleton";
import { useTicketDetails } from "@/features/tickets/hooks/useTicketDetails";
import {
  getMessage,
  getStoryLine,
  sendMessage,
} from "@/features/tickets/services/ticketApi";
import { usePolling } from "@/hooks/usePolling";

import ActivityFeed from "./ActivityFeed";
import ControlPanel from "./ControlPanel";
import DetailHeader from "./DetailHeader";
import DetailOverview from "./DetailOverview";

const STORYLINE_INTERVAL = 10_000;

export default function DetailView() {
  const { id } = useParams();
  const {
    ticket,
    loading,
    error: ticketError,
    accessDenied,
    ticketNotFound,
    isAssignedToCurrentAgent,
    refresh: refreshTicket,
  } = useTicketDetails(id);
  const [timeline, setTimeline] = useState([]);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const currentUserEmail = user?.email;

  const {
    error: pollingError,
    loading: isActivityLoading,
    refresh,
  } = usePolling({
    fetchData: async () => {
      const [timelineData, messageData] = await Promise.all([
        getStoryLine(id),
        getMessage(id),
      ]);
      return { timeline: timelineData, message: messageData };
    },
    onSuccess: (data) => {
      setTimeline(data.timeline);
      setMessage(data.message);
    },
    interval: STORYLINE_INTERVAL,
    enabled: Boolean(ticket && !loading && !ticketError && !accessDenied),
    showInitialLoading: true,
  });

  const handleSendMessage = async (text) => {
    if (isSubmitting || !text.trim() || !id) return;

    try {
      setIsSubmitting(true);
      const optimisticMessage = {
        actorNombre: "Tú",
        autorEmail: currentUserEmail,
        mensaje: text,
        creadoEn: new Date().toISOString(),
      };
      setMessage((prev) => [
        ...(Array.isArray(prev) ? prev : []),
        optimisticMessage,
      ]);
      await sendMessage(id, text);
      refresh();
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || (ticket && isActivityLoading)) {
    return <DetailViewSkeleton />;
  }

  if (ticketError) {
    return <div className="p-6 text-destructive">Error: {ticketError}</div>;
  }

  if (ticketNotFound) {
    return (
      <section className="bg-card border-border mx-auto mt-8 flex min-h-[55vh] max-w-2xl flex-col items-center justify-center gap-5 rounded-3xl border px-6 py-10 text-center shadow-sm sm:px-12">
        <span className="bg-primary/10 text-primary ring-primary/5 flex size-16 items-center justify-center rounded-2xl ring-8">
          <FileQuestion aria-hidden="true" className="size-8" />
        </span>
        <div className="space-y-2">
          <p className="text-primary text-xs font-bold tracking-[0.18em] uppercase">
            Solicitud no encontrada
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            No encontramos ese ticket
          </h1>
          <p className="text-muted-foreground mx-auto max-w-md text-sm leading-6 sm:text-base">
            El enlace puede estar incompleto o la solicitud pudo haber sido
            eliminada. Comprueba la dirección o vuelve al listado de solicitudes.
          </p>
        </div>
        <p className="text-muted-foreground bg-muted max-w-full truncate rounded-md px-3 py-2 font-mono text-xs">
          ID consultado: {id}
        </p>
        <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button asChild variant="outline" className="h-10 rounded-md px-5">
            <Link to="/dashboard">Ir al resumen</Link>
          </Button>
          <Button asChild className="btn-gradient-primary h-10 rounded-md px-5">
            <Link to="/tickets">Volver a solicitudes</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (accessDenied) {
    return (
      <section className="bg-card border-border mx-auto mt-8 flex max-w-xl flex-col items-center gap-4 rounded-2xl border px-6 py-10 text-center shadow-sm sm:px-10">
        <span className="bg-destructive/10 text-destructive flex size-14 items-center justify-center rounded-full">
          <ShieldAlert aria-hidden="true" className="size-7" />
        </span>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">No tienes acceso a este ticket</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Solo puede verlo la persona que lo creó, el agente asignado o un
            supervisor o administrador.
          </p>
        </div>
        <Button asChild variant="outline" className="h-10 rounded-md">
          <Link to="/tickets">Volver a solicitudes</Link>
        </Button>
      </section>
    );
  }

  if (!ticket) {
    return <div className="p-6">Ticket no encontrado.</div>;
  }

  return (
    <div className="grid w-full grid-cols-1 gap-6 py-4 lg:grid-cols-5 2xl:grid-cols-4">
      <DetailHeader ticket={ticket} />
      <div className="order-2 space-y-6 lg:col-span-3 lg:col-start-1 lg:row-start-2 2xl:col-span-3">
        <DetailOverview ticket={ticket} />
        {pollingError ? (
          <div className="bg-destructive/10 text-destructive flex items-center justify-between rounded-lg p-4 text-sm">
            <span>Error al actualizar la actividad en tiempo real.</span>
            <button onClick={refresh} className="font-medium underline">
              Reintentar
            </button>
          </div>
        ) : (
          <ActivityFeed
            timeline={timeline}
            conversation={message}
            currentUserEmail={currentUserEmail}
            onSendMessage={handleSendMessage}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
      <ControlPanel
        ticket={ticket}
        isAssignedToCurrentAgent={isAssignedToCurrentAgent}
        onRefresh={refreshTicket}
      />
    </div>
  );
}
