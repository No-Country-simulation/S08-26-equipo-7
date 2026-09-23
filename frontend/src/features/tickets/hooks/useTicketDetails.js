import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "@/services/apiService";

export const useTicketDetails = (id, initialTicket = null) => {
  const [fetchedTicket, setFetchedTicket] = useState(null);
  const [loadingRequest, setLoadingRequest] = useState(!initialTicket);
  const [error, setError] = useState(null);
  const ticket = initialTicket ?? fetchedTicket;
  const loading = initialTicket ? false : loadingRequest;

  const refresh = useCallback(async () => {
    if (!id) return;

    try {
      setError(null);
      const data = await apiRequest(`/tickets/${id}`);
      setFetchedTicket(data);
    } catch (err) {
      setError(err.message);
    }
  }, [id]);
  useEffect(() => {
    if (initialTicket || !id) return;
    let isMounted = true;
    const loadInitialTicket = async () => {
      try {
        setLoadingRequest(true);
        setError(null);
        const data = await apiRequest(`/tickets/${id}`);
        if (isMounted) {
          setFetchedTicket(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoadingRequest(false);
        }
      }
    };
    loadInitialTicket();
    return () => {
      isMounted = false;
    };
  }, [id, initialTicket]);

  return { ticket, loading, error, refresh };
};
