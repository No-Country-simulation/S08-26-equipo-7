import { useState } from "react";
import { toast } from "sonner";

import Table from "@/features/tickets/components/table/Table";
import { approveTicket, rejectTicket } from "@/features/tickets/services/ticketApi";

export default function ApprovalsPage() {
  const [offset, setOffset] = useState(0);

  const onApprove = async (ticketId) => {
    try {
      await approveTicket(ticketId);
      toast.success("Ticket aprobado con éxito");
    } catch (error) {
      toast.error("Error al aprobar el ticket" + error?.message);
    }
  };

  const onReject = async (ticketId) => {
    try {
      await rejectTicket(ticketId);
      toast.success("Ticket rechazado");
    } catch (error) {
      toast.error("Error al rechazar el ticket" + error?.message);
    }
  };

  return (
    <div>
      <Table 
        filters={{ group: "EN_APROBACION" }} 
        offset={offset} 
        onOffsetChange={setOffset}
        onApprove={onApprove}
        onReject={onReject}
      />
    </div>
  );
}