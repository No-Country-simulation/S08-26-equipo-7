import PriorityBadge from "../badges/PriorityBadge";
export default function DetailOverview({ ticket }) {
  return (
    <div className="bg-card border-border order-2 rounded-lg border p-2 sm:p-4 shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm text-primary font-semibold">
          {ticket.category} • Creado por {ticket.createdByName}
        </p>
        <PriorityBadge priority={ticket.priority} className="mx-2 text-xs sm:text-sm" />
      </div>
      <h1 className="mb-2 text-lg sm:text-xl lg:text-2xl font-bold">{ticket.title}</h1>
      <p className="text-muted-foreground bg-ring rounded-md px-2 sm:px-4 py-2 text-xs sm:text-sm">
        {ticket.description}
      </p>
    </div>
  );
}
