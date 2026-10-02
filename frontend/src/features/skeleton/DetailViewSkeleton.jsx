import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDER_CLASS = "bg-muted-foreground/10";

export default function DetailViewSkeleton() {
  return (
    <div
      className="grid w-full grid-cols-1 gap-6 py-4 lg:grid-cols-5 2xl:grid-cols-4"
      role="status"
      aria-label="Cargando detalle del ticket"
    >
      <span className="sr-only">Cargando detalle del ticket...</span>

      <div className="bg-card border-border order-1 flex min-h-16 flex-wrap items-center justify-between gap-3 rounded-lg border p-4 shadow-md lg:col-span-5 2xl:col-span-4">
        <Skeleton className={`${PLACEHOLDER_CLASS} h-9 w-28 sm:w-36`} />
        <div className="flex gap-2">
          <Skeleton className={`${PLACEHOLDER_CLASS} h-6 w-20 rounded-full`} />
          <Skeleton className={`${PLACEHOLDER_CLASS} h-6 w-24 rounded-full`} />
        </div>
      </div>

      <div className="order-2 space-y-6 lg:col-span-3 lg:col-start-1 lg:row-start-2">
        <div className="bg-card border-border space-y-4 rounded-lg border p-2 shadow-md sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className={`${PLACEHOLDER_CLASS} h-4 w-2/3 sm:h-5`} />
            <Skeleton className={`${PLACEHOLDER_CLASS} h-6 w-20 shrink-0 rounded-full`} />
          </div>
          <Skeleton className={`${PLACEHOLDER_CLASS} h-6 w-3/4 sm:h-8`} />
          <div className="bg-ring space-y-2 rounded-md px-2 py-2 sm:px-4">
            <Skeleton className={`${PLACEHOLDER_CLASS} h-4 w-full`} />
            <Skeleton className={`${PLACEHOLDER_CLASS} h-4 w-4/5`} />
          </div>
        </div>

        <div className="bg-card border-border border shadow-md rounded-lg min-h-[24rem]">
          <div className="bg-muted-foreground/5 w-full rounded-t-lg px-2">
            <div className="border-primary w-fit border-b-2 py-4">
              <Skeleton className={`${PLACEHOLDER_CLASS} h-4 w-64`} />
            </div>
          </div>
          <div className="p-4">
            <div className="mb-8">
              <Skeleton className={`${PLACEHOLDER_CLASS} mb-3 h-4 w-28`} />
              <div className="bg-muted-foreground/5 space-y-4 rounded-lg p-4 pl-6">
                {[0, 1].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Skeleton className={`${PLACEHOLDER_CLASS} mt-1.5 size-2 shrink-0 rounded-full`} />
                    <div className="flex-1 space-y-2">
                      <Skeleton className={`${PLACEHOLDER_CLASS} h-3 w-2/5`} />
                      <Skeleton className={`${PLACEHOLDER_CLASS} h-4 w-4/5`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-border border-t p-2 sm:p-4">
              <Skeleton className={`${PLACEHOLDER_CLASS} mb-2 h-4 w-24`} />
              <Skeleton className={`${PLACEHOLDER_CLASS} h-16 w-full rounded-lg`} />
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Skeleton className={`${PLACEHOLDER_CLASS} h-10 min-w-35 flex-1`} />
                <Skeleton className={`${PLACEHOLDER_CLASS} h-11 w-full sm:w-24`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border-border order-3 h-fit self-start rounded-lg border p-4 shadow-md lg:col-span-2 lg:col-start-4 lg:row-start-2 2xl:col-span-1 2xl:col-start-4">
        <Skeleton className={`${PLACEHOLDER_CLASS} mb-4 h-6 w-48`} />
        <div className="bg-ring mt-4 rounded-lg p-4">
          <div className="mb-2 flex justify-between gap-3">
            <Skeleton className={`${PLACEHOLDER_CLASS} h-4 w-28`} />
            <Skeleton className={`${PLACEHOLDER_CLASS} h-4 w-16`} />
          </div>
          <Skeleton className={`${PLACEHOLDER_CLASS} h-2 w-full`} />
        </div>
        <div className="mt-4 space-y-4">
          <div className="border-border flex items-center justify-between border-b pb-3">
            <Skeleton className={`${PLACEHOLDER_CLASS} h-4 w-24`} />
            <Skeleton className={`${PLACEHOLDER_CLASS} h-4 w-32`} />
          </div>
          <div className="border-border flex items-center justify-between border-b pb-3">
            <Skeleton className={`${PLACEHOLDER_CLASS} h-4 w-20`} />
            <Skeleton className={`${PLACEHOLDER_CLASS} h-6 w-24 rounded-full`} />
          </div>
          <div className="border-border flex items-center justify-between border-b pb-3">
            <Skeleton className={`${PLACEHOLDER_CLASS} h-4 w-16`} />
            <Skeleton className={`${PLACEHOLDER_CLASS} h-4 w-28`} />
          </div>
          <Skeleton className={`${PLACEHOLDER_CLASS} h-11 w-full rounded-md`} />
        </div>
      </div>
    </div>
  );
}
