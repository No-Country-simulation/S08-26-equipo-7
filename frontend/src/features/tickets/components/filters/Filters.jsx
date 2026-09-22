import CategoryFilter from "@/features/tickets/components/filters/CategoryFilter";
import PriorityFilter from "@/features/tickets/components/filters/PriorityFilter";
import SearchFilter from "@/features/tickets/components/filters/SearchFilter";
import StatusFilter from "@/features/tickets/components/filters/StatusFilter";
export default function Filters({ filters, onFilterChange }) {
  return (
    <div className="bg-card border-border my-4 flex flex-wrap gap-2 rounded-lg border p-4 shadow-md">
      <div className="min-w-34 flex-1 sm:min-w-64">
        <SearchFilter
          value={filters.search}
          onChange={(val) => onFilterChange("search", val)}
        />
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
        <CategoryFilter
          value={filters.category}
          onChange={(val) => onFilterChange("category", val)}
        />
        <StatusFilter
          value={filters.group}
          onChange={(value) => onFilterChange("group", value)}
        />
        <PriorityFilter
          value={filters.priority}
          onChange={(val) => onFilterChange("priority", val)}
        />
      </div>
    </div>
  );
}
