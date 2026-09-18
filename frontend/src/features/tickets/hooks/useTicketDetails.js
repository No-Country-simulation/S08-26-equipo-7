import { useEffect, useState } from "react";

import { apiRequest } from "@/services/apiService";

export const useTicketDetails = (id) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchTicket = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiRequest(`/tickets/${id}`);
        setTicket(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  return { ticket, loading, error };
};
