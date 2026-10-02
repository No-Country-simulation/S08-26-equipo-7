import { useLayoutEffect, useRef, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

const DEPARTMENT_ROWS = 5;
const MOBILE_BREAKPOINT = 768;

function DesktopSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="bg-muted-foreground/5 grid h-10 grid-cols-[15%_35%_20%_15%_15%] items-center px-4">
        {["mx-auto w-12", "w-36", "mx-auto w-24", "mx-auto w-12", "mx-auto w-14"].map((width) => (
          <Skeleton key={width} className={`h-3 ${width}`} />
        ))}
      </div>
      {Array.from({ length: DEPARTMENT_ROWS }, (_, index) => (
        <div
          key={index}
          className="border-border grid min-h-[4.5rem] grid-cols-[15%_35%_20%_15%_15%] items-center gap-2 border-t px-4 py-2"
        >
          <Skeleton className="mx-auto h-4 w-16" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-4/5" />
          </div>
          <Skeleton className="mx-auto h-6 w-24 rounded-full" />
          <Skeleton className="mx-auto h-6 w-16 rounded-full" />
          <Skeleton className="mx-auto size-9 rounded-md" />
        </div>
      ))}
    </div>
  );
}

function MobileSkeleton() {
  const fields = ["CÓDIGO", "NOMBRE", "REQUIERE APROBACIÓN", "ESTADO", "ACCIONES"];

  return (
    <div aria-hidden="true">
      <Table>
        <TableBody className="border-border border">
          {Array.from({ length: DEPARTMENT_ROWS }, (_, departmentIndex) =>
            fields.map((field, fieldIndex) => (
              <TableRow key={`${departmentIndex}-${field}`}>
                <TableCell
                  className={`bg-muted-foreground/5 text-muted-foreground w-1/3 text-xs font-bold whitespace-normal ${fieldIndex === fields.length - 1 ? "border-border border-b-4" : ""}`}
                >
                  <Skeleton className="h-3 w-4/5" />
                </TableCell>
                <TableCell
                  className={`w-2/3 whitespace-normal ${fieldIndex === fields.length - 1 ? "border-border border-b-4" : ""}`}
                >
                  {fieldIndex === 1 ? (
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ) : fieldIndex === 4 ? (
                    <Skeleton className="h-9 w-24 rounded-md" />
                  ) : (
                    <Skeleton className="h-5 w-24 rounded-full" />
                  )}
                </TableCell>
              </TableRow>
            )),
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function DepartmensSkeleton() {
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
    <div ref={containerRef} role="status" aria-label="Cargando departamentos">
      <span className="sr-only">Cargando departamentos...</span>
      {isMobile ? <MobileSkeleton /> : <DesktopSkeleton />}
    </div>
  );
}
