import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_ROWS = 6;

export default function TableSkeleton({ mobile = false }) {
  return (
    <div className="space-y-3 p-4" role="status" aria-label="Cargando tickets">
      <span className="sr-only">Cargando tickets...</span>
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <div
          className={mobile ? "grid grid-cols-[minmax(6rem,25%)_1fr] gap-3" : "grid grid-cols-[1.5fr_repeat(5,1fr)_auto] gap-4"}
          key={index}
        >
          {Array.from({ length: mobile ? 2 : 7 }, (_, cellIndex) => (
            <Skeleton
              className={mobile ? "h-5 bg-muted-foreground/20" : cellIndex === 0 ? "h-6 bg-muted-foreground/20" : "h-5 bg-muted-foreground/20"}
              key={cellIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
