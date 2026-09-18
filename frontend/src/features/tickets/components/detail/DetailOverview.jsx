import PriorityBadge from "../badges/PriorityBadge";
export default function DetailOverview({ ticket }) {
  return (
    <div className="bg-card border-border order-2 rounded-lg border p-4 shadow-md lg:col-span-3">
      <div className="flex items-center justify-between">
        <p className="text-md text-primary font-semibold">
          {ticket.category} • Creado por {ticket.createdByName}
        </p>
        <PriorityBadge priority={ticket.priority} className="mx-2 text-sm" />
      </div>
      <h1 className="mb-2 text-2xl font-bold">{ticket.title}</h1>
      <p className="text-muted-foreground bg-chart-2/10 rounded-md px-4 py-2 text-sm">
        {ticket.description}
      </p>
    </div>
  );
}
