import { useEffect, useState } from "react";

import { apiRequest } from "@/services/apiService";

export const useTicketDetails = (id, initialTicket = null) => {
  const [fetchedTicket, setFetchedTicket] = useState(null);
  const [loadingRequest, setLoadingRequest] = useState(!initialTicket);
  const [error, setError] = useState(null);

  const ticket = initialTicket ?? fetchedTicket;
  const loading = initialTicket ? false : loadingRequest;

  useEffect(() => {
    if (!id || initialTicket) return;

    const fetchTicket = async () => {
      try {
        setLoadingRequest(true);
        setError(null);

        const data = await apiRequest(`/tickets/${id}`);
        setFetchedTicket(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingRequest(false);
      }
    };

    fetchTicket();
  }, [id, initialTicket]);

  return { ticket, loading, error };
};
