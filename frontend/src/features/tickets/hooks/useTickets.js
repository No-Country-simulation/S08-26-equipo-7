import { useEffect,useState } from "react";

import { getTickets } from "@/features/tickets/services/ticketApi";

export function useTickets(params = { limit: 5, offset: 0 }) {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    async function fetchTickets() {
      try {
        setLoading(true);
        setError(null);
        const data = await getTickets(JSON.parse(paramsKey));
        setTickets(data.items);
        setTotal(data.total);
        setOffset(data.offset);
        setLimit(data.limit);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, [paramsKey]); // Se reejecuta si cambian los parámetros de búsqueda/paginación

  return { tickets, total, offset, limit, loading, error };
}