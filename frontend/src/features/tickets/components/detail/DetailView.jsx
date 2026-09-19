import { Skeleton } from "@/components/ui/skeleton";

import ActivityFeed from "./ActivityFeed";
import ControlPanel from "./ControlPanel";
import DetailHeader from "./DetailHeader";
import DetailOverview from "./DetailOverview";

function DetailViewSkeleton() {
  return (
    <div
      className="grid w-full grid-cols-1 gap-6 py-4 lg:grid-cols-5 2xl:grid-cols-4"
      role="status"
      aria-label="Cargando detalle del ticket"
    >
      <span className="sr-only">Cargando detalle del ticket...</span>
      <div className="bg-card border-border order-1 flex h-20 items-center justify-between rounded-lg border p-4 shadow-md lg:col-span-5 2xl:col-span-4">
        <Skeleton className="bg-muted-foreground/10 h-9 w-36" />
        <div className="flex gap-2">
          <Skeleton className="bg-muted-foreground/10 h-6 w-20" />
          <Skeleton className="bg-muted-foreground/10 h-6 w-24" />
        </div>
      </div>
      <div className="order-2 space-y-6 lg:col-span-3 lg:col-start-1 lg:row-start-2">
        <div className="bg-card border-border space-y-4 rounded-lg border p-4 shadow-md">
          <div className="flex items-center justify-between">
            <Skeleton className="bg-muted-foreground/10 h-5 w-64" />
            <Skeleton className="bg-muted-foreground/10 h-6 w-20" />
          </div>
          <Skeleton className="bg-muted-foreground/10 h-8 w-3/4" />
          <Skeleton className="bg-muted-foreground/10 h-16 w-full" />
        </div>
        <div className="bg-card border-border flex h-32 items-center rounded-lg border p-4 shadow-md">
          <Skeleton className="bg-muted-foreground/10 h-9 w-36" />
        </div>
      </div>
      <div className="bg-card border-border order-3 h-fit rounded-lg border p-4 shadow-md lg:col-span-2 lg:col-start-4 lg:row-start-2 2xl:col-span-1 2xl:col-start-4">
        <Skeleton className="bg-muted-foreground/10 mb-5 h-6 w-48" />
        <Skeleton className="bg-muted-foreground/10 mb-2 h-4 w-32" />
        <div className="border-border flex h-12 items-center rounded-md border px-4">
          <Skeleton className="bg-muted-foreground/10 h-4 w-36" />
        </div>
        <div className="mt-5">
          <div className="mb-2 flex justify-between">
            <Skeleton className="bg-muted-foreground/10 h-4 w-28" />
            <Skeleton className="bg-muted-foreground/10 h-4 w-16" />
          </div>
          <Skeleton className="bg-muted-foreground/10 h-2 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function DetailView({ ticket, loading = false }) {
  if (loading) {
    return <DetailViewSkeleton />;
  }

  return (
    <div className="grid w-full grid-cols-1 gap-6 py-4 lg:grid-cols-5 2xl:grid-cols-4">
      <DetailHeader ticket={ticket} />
      <div className="order-2 contents lg:col-span-3 lg:col-start-1 lg:row-start-2 lg:flex lg:flex-col lg:gap-6 2xl:col-span-3">
        <DetailOverview ticket={ticket} />
        <ActivityFeed activities={ticket} />
      </div>
      <ControlPanel ticket={ticket} />
    </div>
  );
}
