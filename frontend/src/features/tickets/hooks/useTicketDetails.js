import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { getTickets } from "@/features/tickets/services/ticketApi";
import { apiRequest } from "@/services/apiService";

export const useTicketDetails = (id, initialTicket = null) => {
  const [fetchedTicket, setFetchedTicket] = useState(null);
  const [loadedId, setLoadedId] = useState(null);
  const [loadingRequest, setLoadingRequest] = useState(!initialTicket);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [ticketNotFound, setTicketNotFound] = useState(false);
  const [isAssignedToCurrentAgent, setIsAssignedToCurrentAgent] = useState(false);
  const { user, isAgent, isRequester } = useAuth();
  const ticket = initialTicket ?? (loadedId === id ? fetchedTicket : null);
  const loading = initialTicket ? false : loadingRequest || loadedId !== id;

  const loadTicket = useCallback(async () => {
    if (!id) return;

    setError(null);
    setAccessDenied(false);
    setTicketNotFound(false);
    setIsAssignedToCurrentAgent(false);
    let isAssigned = false;

    if (isAgent || isRequester) {
      const scopedTickets = await getTickets({
        search: id,
        group: "all",
        limit: 10,
        offset: 0,
      });
      const relatedTicket = scopedTickets.items?.find(
        (item) => String(item.id) === String(id),
      );
      isAssigned = isAgent && Boolean(relatedTicket?.assignedTo);

      if (!relatedTicket && isRequester) {
        setAccessDenied(true);
        setFetchedTicket(null);
        setLoadedId(id);
        return;
      }
    }

    const data = await apiRequest(`/tickets/${id}`);
    if (!data?.id) {
      if (!isAgent && !isRequester) {
        setTicketNotFound(true);
      } else {
        setAccessDenied(true);
      }
      setFetchedTicket(null);
      setLoadedId(id);
      return;
    }

    const ticketEmail = data.email?.trim().toLocaleLowerCase();
    const currentEmail = user?.email?.trim().toLocaleLowerCase();
    const isCreator = Boolean(ticketEmail && currentEmail && ticketEmail === currentEmail);

    if ((isRequester && !isCreator) || (isAgent && !isAssigned && !isCreator)) {
      setAccessDenied(true);
      setFetchedTicket(null);
      setLoadedId(id);
      return;
    }

    setIsAssignedToCurrentAgent(isAssigned);
    setFetchedTicket(data);
    setLoadedId(id);
    return data;
  }, [id, isAgent, isRequester, user?.email]);

  const refresh = useCallback(async () => {
    if (!id) return;

    try {
      await loadTicket();
    } catch (err) {
      if (err.status === 403 || err.status === 404) {
        if (err.status === 404 && !isAgent && !isRequester) {
          setTicketNotFound(true);
        } else {
          setAccessDenied(true);
        }
        setFetchedTicket(null);
      } else {
        setError(err.message);
      }
      setLoadedId(id);
    }
  }, [id, isAgent, isRequester, loadTicket]);

  useEffect(() => {
    if (initialTicket || !id) return;
    let isMounted = true;
    const loadInitialTicket = async () => {
      try {
        setLoadingRequest(true);
        setError(null);
        setAccessDenied(false);
        setTicketNotFound(false);
        setFetchedTicket(null);
        await loadTicket();
      } catch (err) {
        if (isMounted) {
          if (err.status === 403 || err.status === 404) {
            if (err.status === 404 && !isAgent && !isRequester) {
              setTicketNotFound(true);
            } else {
              setAccessDenied(true);
            }
            setFetchedTicket(null);
          } else {
            setError(err.message);
          }
          setLoadedId(id);
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
  }, [id, initialTicket, isAgent, isRequester, loadTicket]);

  return {
    ticket,
    loading,
    error,
    accessDenied,
    ticketNotFound,
    isAssignedToCurrentAgent,
    refresh,
  };
};
