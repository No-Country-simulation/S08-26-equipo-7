import { Skeleton } from "@/components/ui/skeleton";

export default function StatCardSkeleton({
  label = "Tarjeta de estadísticas",
  text = "",
  iconText,
}) {
  return (
    <div
      className="bg-card border-border my-2 flex w-full max-w-62.5 min-w-42 flex-col rounded-lg border p-4 shadow-md"
      role="status"
      aria-label={`Cargando ${label.toLowerCase()}`}
    >
      <span className="sr-only">Cargando {label.toLowerCase()}...</span>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-muted-foreground relative text-sm font-semibold" aria-hidden="true">
          <span className="invisible">{label}</span>
          <Skeleton className="absolute inset-0 h-full w-full bg-muted-foreground/10" />
        </div>
        <Skeleton className="size-7 shrink-0 rounded-md bg-muted-foreground/10" />
      </div>
      <Skeleton className="mb-4 h-9 w-16 bg-muted-foreground/10" />
      <div className="flex items-center" aria-hidden="true">
        <span className="mr-1 text-transparent [&_svg]:size-4">{iconText}</span>
        <span className="relative text-sm font-medium text-transparent">
          {text}
          <Skeleton className="absolute inset-0 h-full w-full bg-muted-foreground/10" />
        </span>
      </div>
    </div>
  );
}
