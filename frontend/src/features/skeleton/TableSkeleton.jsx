import { useLayoutEffect, useRef, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MOBILE_BREAKPOINT = 1012;
const FULL_LIST_ROWS = 10;
const RECENT_LIST_ROWS = 5;

function DesktopTableSkeleton({ compact, rowCount }) {
  const columns = compact
    ? ["w-3/5", "w-3/4", "w-14", "w-20", "w-16", "w-8"]
    : ["w-3/5", "w-3/4", "w-3/4", "w-14", "w-20", "w-16", "w-8"];

  return (
    <Table aria-hidden="true">
      <TableHeader>
        <TableRow>
          {columns.map((width, index) => (
            <TableHead key={index}>
              <Skeleton className={`mx-auto h-3 ${width}`} />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }, (_, index) => (
          <TableRow key={index} className="h-[4.5rem]">
            <TableCell className="space-y-2 pl-4">
              <Skeleton className="h-3.5 w-14" />
              <Skeleton className="h-4 w-4/5" />
            </TableCell>
            {!compact && (
              <TableCell>
                <Skeleton className="mx-auto h-4 w-3/4" />
              </TableCell>
            )}
            <TableCell>
              <Skeleton className="mx-auto h-5 w-20 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="mx-auto h-5 w-14 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="mx-auto h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="mx-auto h-5 w-20 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="mx-auto size-8 rounded-md" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function MobileTableSkeleton({ compact, rowCount }) {
  const fields = [
    "ID Y TÍTULO",
    ...(!compact ? ["SOLICITANTE"] : []),
    "CATEGORÍA",
    "PRIORIDAD",
    "SLA RESTANTE",
    "ESTADO",
    "ACCIÓN",
  ];

  return (
    <Table aria-hidden="true">
      <TableBody className="border-border border">
        {Array.from({ length: rowCount }, (_, ticketIndex) => (
          <FragmentRows fields={fields} key={ticketIndex} ticketIndex={ticketIndex} />
        ))}
      </TableBody>
    </Table>
  );
}

function FragmentRows({ fields, ticketIndex }) {
  return fields.map((field, fieldIndex) => (
    <TableRow key={`${ticketIndex}-${field}`}>
      <TableCell
        className={`bg-muted-foreground/5 text-muted-foreground w-1/4 whitespace-normal ${fieldIndex === fields.length - 1 ? "border-border border-b-4" : ""}`}
      >
        <Skeleton className="h-3 w-full max-w-24" />
      </TableCell>
      <TableCell
        className={`w-3/4 whitespace-normal ${fieldIndex === fields.length - 1 ? "border-border border-b-4" : ""}`}
      >
        {field === "ID Y TÍTULO" ? (
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-14" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ) : field === "ACCIÓN" ? (
          <Skeleton className="h-8 w-24 rounded-md" />
        ) : (
          <Skeleton className="h-5 w-20 rounded-full" />
        )}
      </TableCell>
    </TableRow>
  ));
}

export default function TableSkeleton({ compact = false, mobile = false }) {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const isCompact = compact || mobile;
  const rowCount = isCompact ? RECENT_LIST_ROWS : FULL_LIST_ROWS;

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
    <div
      ref={containerRef}
      className="w-full"
      role="status"
      aria-label="Cargando solicitudes"
    >
      <span className="sr-only">Cargando solicitudes...</span>
      {isMobile ? (
        <MobileTableSkeleton compact={isCompact} rowCount={rowCount} />
      ) : (
        <DesktopTableSkeleton compact={isCompact} rowCount={rowCount} />
      )}
    </div>
  );
}
