import { useEffect, useState } from "react";

import { getTickets } from "@/features/tickets/services/ticketApi";
import { usePolling } from "@/hooks/usePolling";

const TICKETS_POLL_INTERVAL = 30_000;

export function useTickets(params = { limit: 5, offset: 0 }) {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [tickets, setTickets] = useState([]);
  const paramsKey = JSON.stringify(params);
  const { loading, error, refresh } = usePolling({
    fetchData: () => getTickets(JSON.parse(paramsKey)),
    onSuccess: (data) => {
      setTickets(data.items);
      setTotal(data.total);
      setOffset(data.offset);
      setLimit(data.limit);
    },
    interval: TICKETS_POLL_INTERVAL,
  });

  useEffect(() => {
    function handleTicketCreated() {
      refresh();
    }

    window.addEventListener("ticket-created", handleTicketCreated);

    return () => {
      window.removeEventListener("ticket-created", handleTicketCreated);
    };
  }, [refresh]);

  return { tickets, total, offset, limit, loading, error };
}
