import { useEffect,useState } from "react";

import { getTickets } from "@/features/tickets/services/ticketApi";

export function useTickets(params = { limit: 5 }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    async function fetchTickets() {
      try {
        setLoading(true);
        const data = await getTickets(JSON.parse(paramsKey));
        setTickets(data.items);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, [paramsKey]); // Se reejecuta si cambian los parámetros de búsqueda/paginación

  return { tickets, loading, error };
}