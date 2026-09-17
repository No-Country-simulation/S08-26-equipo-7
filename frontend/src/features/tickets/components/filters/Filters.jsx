import CategoryFilter from "@/features/tickets/components/filters/CategoryFilter";
import PriorityFilter from "@/features/tickets/components/filters/PriorityFilter";
import SearchFilter from "@/features/tickets/components/filters/SearchFilter";
import StatusFilter from "@/features/tickets/components/filters/StatusFilter";
export default function Filters({ filters, onFilterChange }) {
  return(
    <div className="p-4 bg-card rounded-lg my-4 flex flex-wrap gap-2 border border-border shadow-md">
      <div className="flex-1 min-w-34 sm:min-w-64">
        <SearchFilter value={filters.search} 
          onChange={(val) => onFilterChange("search", val)} />
      </div>
      <div className="flex flex-col w-full gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
        <CategoryFilter value={filters.category} onChange={(val) => onFilterChange("category", val)} />
        <StatusFilter value={filters.group} onChange={(value) => onFilterChange("group", value)} />
        <PriorityFilter value={filters.priority} onChange={(val) => onFilterChange("priority", val)} />
      </div>
    </div>
  );
};