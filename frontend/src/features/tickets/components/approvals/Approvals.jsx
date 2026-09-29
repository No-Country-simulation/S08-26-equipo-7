import Table from "@/features/tickets/components/table/Table";
import TicketApprovalActionsProvider from "@/features/tickets/context/TicketApprovalActionsContext";
import TicketListProvider from "@/features/tickets/context/TicketListContext";

export default function ApprovalsPage() {
  return (
    <TicketListProvider initialFilters={{ group: "EN_APROBACION" }}>
      <TicketApprovalActionsProvider>
        <Table />
      </TicketApprovalActionsProvider>
    </TicketListProvider>
  );
}
