import { TICKET_STATUS_CONFIG } from "@/lib/ticketMappers";

export default function TicketStatusBadge({ status }) {
  const config = TICKET_STATUS_CONFIG[status] || TICKET_STATUS_CONFIG.SUBMITTED;

  return (
    <span className={`border py-1 px-2 mt-1 rounded-full text-xs sm:text-sm font-medium ${config.badgeClass}`}>
      {config.label}
    </span>
  );
};
