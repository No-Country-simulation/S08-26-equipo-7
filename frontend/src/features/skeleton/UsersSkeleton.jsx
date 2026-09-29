import { Skeleton } from "@/components/ui/skeleton";

export default function UsersSkeleton() {
  return (
    <div className="p-2 w-full space-y-2">
      <Skeleton className="h-10 w-full p-1 border border-border bg-muted-foreground/10" />
      <Skeleton className="h-10 w-full p-1 border border-border bg-muted-foreground/10" />
      <Skeleton className="h-10 w-full p-1 border border-border bg-muted-foreground/10" />
      <Skeleton className="h-10 w-full p-1 border border-border bg-muted-foreground/10" />
      <Skeleton className="h-10 w-full p-1 border border-border bg-muted-foreground/10" />
    </div>
  );
}
