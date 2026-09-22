import { Skeleton } from "@/components/ui/skeleton";

export default function StatCardSkeleton({ label = "Tarjeta de estadísticas" }) {
  return (
    <div
      className="bg-card border-border my-2 flex w-full max-w-62.5 min-w-42 flex-col rounded-lg border p-4 shadow-md"
      role="status"
      aria-label={`Cargando ${label.toLowerCase()}`}
    >
      <span className="sr-only">Cargando {label.toLowerCase()}...</span>
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-4 w-28 bg-muted-foreground/10" />
        <Skeleton className="size-7 rounded-md bg-muted-foreground/10" />
      </div>
      <Skeleton className="mb-4 h-9 w-16 bg-muted-foreground/10" />
      <Skeleton className="h-4 w-36 bg-muted-foreground/10" />
    </div>
  );
}