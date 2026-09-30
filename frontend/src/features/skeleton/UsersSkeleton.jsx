import { useLayoutEffect, useRef, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

const USER_ROWS = 5;
const MOBILE_BREAKPOINT = 700;

function DesktopUsersSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="bg-muted/40 grid h-10 grid-cols-[34%_17%_29%_20%] items-center px-5">
        {["w-14", "w-8", "w-32", "ml-auto w-14"].map((width) => (
          <Skeleton key={width} className={`h-3 ${width}`} />
        ))}
      </div>
      {Array.from({ length: USER_ROWS }, (_, index) => (
        <div
          key={index}
          className="border-border grid min-h-[4.25rem] grid-cols-[34%_17%_29%_20%] items-center border-t px-5 py-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3.5 w-4/5" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex justify-end gap-1">
            <Skeleton className="size-11 rounded-md" />
            <Skeleton className="size-11 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MobileUsersSkeleton() {
  return (
    <ul className="divide-y" aria-hidden="true">
      {Array.from({ length: USER_ROWS }, (_, index) => (
        <li key={index} className="p-4 sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3.5 w-4/5" />
            </div>
            <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
          </div>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <dt className="text-muted-foreground">Área</dt>
            <dd><Skeleton className="h-4 w-3/4" /></dd>
          </dl>
          <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(min(100%,11rem),1fr))] gap-2">
            <Skeleton className="h-11 w-full rounded-md" />
            <Skeleton className="h-11 w-full rounded-md" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function UsersSkeleton() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element || typeof ResizeObserver === "undefined") return undefined;

    const updateLayout = () => {
      setIsMobile(element.getBoundingClientRect().width < MOBILE_BREAKPOINT);
    };
    updateLayout();

    const observer = new ResizeObserver(updateLayout);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} role="status" aria-label="Cargando usuarios">
      <span className="sr-only">Cargando usuarios...</span>
      {isMobile ? <MobileUsersSkeleton /> : <DesktopUsersSkeleton />}
    </div>
  );
}
