import SearchFilter from "@/components/SearchFilter";
import TicketCategoryFilter from "@/features/tickets/components/TicketCategoryFilter";
import TicketStatusFilter from "@/features/tickets/components/TicketStatusFilter";
export default function TicketFilters() {
  return(
    <div className="p-4 bg-card rounded-lg my-4 flex justify-between border border-border shadow-md">
      <SearchFilter />
      <div className="mx-2 flex space-x-2">
        <TicketCategoryFilter />
        <TicketStatusFilter />
      </div>
    </div>
  );
};