import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { toast } from "sonner";

import {
  approveTicket,
  rejectTicket,
} from "@/features/tickets/services/ticketApi";

const TicketApprovalActionsContext = createContext(null);

export default function TicketApprovalActionsProvider({ children }) {
  const approve = useCallback(async (ticketId) => {
    try {
      await approveTicket(ticketId);
      toast.success("Ticket aprobado con éxito");
      return true;
    } catch (error) {
      toast.error("Error al aprobar el ticket" + error?.message);
      return false;
    }
  }, []);

  const reject = useCallback(async (ticketId) => {
    try {
      await rejectTicket(ticketId);
      toast.success("Ticket rechazado");
      return true;
    } catch (error) {
      toast.error("Error al rechazar el ticket" + error?.message);
      return false;
    }
  }, []);

  const value = useMemo(() => ({ approve, reject }), [approve, reject]);

  return (
    <TicketApprovalActionsContext.Provider value={value}>
      {children}
    </TicketApprovalActionsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOptionalTicketApprovalActions() {
  return useContext(TicketApprovalActionsContext);
}
