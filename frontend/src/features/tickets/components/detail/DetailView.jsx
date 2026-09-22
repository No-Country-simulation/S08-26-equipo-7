import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "@/features/auth/hooks/useAuth";
import DetailViewSkeleton from "@/features/skeleton/DetailViewSkeleton";
import { useTicketDetails } from "@/features/tickets/hooks/useTicketDetails";
import { getStatus } from "@/features/tickets/services/statusApi"; // 👈 Importamos el servicio de estados
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
  const { ticket, loading, error: ticketError } = useTicketDetails(id);
  const [timeline, setTimeline] = useState([]);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [loadingStatusOptions, setLoadingStatusOptions] = useState(true);
  const { user } = useAuth();
  const currentUserEmail = user?.email;

  useEffect(() => {
    getStatus()
      .then(setStatusOptions)
      .catch((err) => console.error("Error al cargar estados:", err))
      .finally(() => setLoadingStatusOptions(false));
  }, []);

  const { error: pollingError, refresh } = usePolling({
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
    showInitialLoading: false,
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

  if (loading) {
    return <DetailViewSkeleton />;
  }

  if (ticketError) {
    return <div className="p-6 text-red-500">Error: {ticketError}</div>;
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
        options={statusOptions}
        loadingOptions={loadingStatusOptions}
      />
    </div>
  );
}
