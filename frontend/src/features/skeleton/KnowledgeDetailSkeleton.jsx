import { Skeleton } from "@/components/ui/skeleton";

function SkeletonBlock({ className = "" }) {
  return (
    <div className={`bg-card border-border space-y-3 rounded-lg border p-4 shadow-sm ${className}`}>
      <Skeleton className="h-4 w-2/3 bg-muted-foreground/10" />
      <Skeleton className="h-4 w-full bg-muted-foreground/10" />
      <Skeleton className="h-4 w-4/5 bg-muted-foreground/10" />
    </div>
  );
}

export default function KnowledgeDetailSkeleton() {
  return (
    <div
      className="mx-auto min-h-[70vh] max-w-7xl space-y-4 p-4 font-sans"
      role="status"
      aria-label="Cargando artículo"
    >
      <span className="sr-only">Cargando artículo...</span>
      <div className="bg-card border-border flex min-h-14 flex-wrap items-center justify-between gap-3 rounded-lg border p-3 shadow-sm">
        <Skeleton className="h-5 w-48 bg-muted-foreground/10" />
        <Skeleton className="h-9 w-32 bg-muted-foreground/10" />
      </div>
      <div className="grid min-h-[calc(70vh-5rem)] grid-cols-1 items-start gap-6 lg:grid-cols-4">
        <div className="space-y-4">
          <SkeletonBlock />
          <SkeletonBlock />
        </div>
        <div className="space-y-4 lg:col-span-2">
          <div className="bg-card border-border space-y-4 rounded-lg border p-4 shadow-md sm:p-6">
            <div className="flex justify-end">
              <Skeleton className="h-4 w-48 bg-muted-foreground/10" />
            </div>
            <Skeleton className="h-9 w-4/5 bg-muted-foreground/10 sm:h-10" />
            <Skeleton className="h-16 w-full bg-muted-foreground/10" />
          </div>
          <SkeletonBlock />
          <SkeletonBlock />
          <div className="bg-card border-border flex min-h-24 flex-col justify-center gap-3 rounded-lg border px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-52 bg-muted-foreground/10" />
              <Skeleton className="h-3 w-40 bg-muted-foreground/10" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16 bg-muted-foreground/10" />
              <Skeleton className="h-8 w-16 bg-muted-foreground/10" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <SkeletonBlock />
          <SkeletonBlock />
        </div>
      </div>
    </div>
  );
}
