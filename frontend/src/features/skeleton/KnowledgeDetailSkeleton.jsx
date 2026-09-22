import { Skeleton } from "@/components/ui/skeleton";

export default function KnowledgeDetailSkeleton() {
  return (
    <div
      className="bg-card border-border space-y-4 rounded-lg border p-6 shadow-md"
      role="status"
      aria-label="Cargando artículo"
    >
      <span className="sr-only">Cargando artículo...</span>
      <Skeleton className="bg-muted-foreground/10 h-6 w-24" />
      <Skeleton className="bg-muted-foreground/10 h-10 w-3/4" />
      <Skeleton className="bg-muted-foreground/10 h-24 w-full" />
    </div>
  );
}