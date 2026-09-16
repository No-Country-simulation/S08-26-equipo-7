import SearchFilter from "@/components/SearchFilter";
import TicketCategoryFilter from "@/features/tickets/components/TicketCategoryFilter";
import TicketPriorityFilter from "@/features/tickets/components/TicketPriorityFilter";
import TicketStatusFilter from "@/features/tickets/components/TicketStatusFilter";
export default function TicketFilters({ filters, onFilterChange }) {
  return(
    <div className="p-4 bg-card rounded-lg my-4 flex flex-wrap gap-2 border border-border shadow-md">
      <div className="flex-1 min-w-34 sm:min-w-64">
        <SearchFilter value={filters.search} 
          onChange={(val) => onFilterChange("search", val)} />
      </div>
      <div className="flex flex-col w-full gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
        <TicketCategoryFilter value={filters.category} onChange={(val) => onFilterChange("category", val)} />
        <TicketStatusFilter value={filters.status} onChange={(val) => onFilterChange("status", val)} />
        <TicketPriorityFilter value={filters.priority} onChange={(val) => onFilterChange("priority", val)} />
      </div>
    </div>
  );
};