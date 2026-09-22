import { Skeleton } from "@/components/ui/skeleton";
export default function ControlPanelSkeleton() {
  return (
    <div
      className="border-border flex h-12 w-full items-center rounded-md border p-4"
      role="status"
      aria-label="Cargando estados"
    >
      <span className="sr-only">Cargando estados...</span>
      <Skeleton className="bg-muted-foreground/10 h-4 w-36" />
    </div>
  );
}