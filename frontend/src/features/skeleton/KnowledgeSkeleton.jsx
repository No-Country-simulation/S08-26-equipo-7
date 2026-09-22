import { Skeleton } from "@/components/ui/skeleton";
export default function KnowledgeSkeleton() {
  return (
    <div
      className="bg-card border-border h-full space-y-3 rounded-lg border p-4 shadow-md"
      role="status"
      aria-label="Cargando artículo"
    >
      <span className="sr-only">Cargando artículo...</span>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24 bg-muted-foreground/10" />
        <Skeleton className="h-4 w-20 bg-muted-foreground/10" />
      </div>
      <Skeleton className="h-7 w-3/4 bg-muted-foreground/10" />
      <Skeleton className="h-16 w-full bg-muted-foreground/10" />
      <div className="border-border flex items-center justify-between border-t pt-3">
        <Skeleton className="h-4 w-36 bg-muted-foreground/10" />
        <Skeleton className="size-4 bg-muted-foreground/10" />
      </div>
    </div>
  );
}