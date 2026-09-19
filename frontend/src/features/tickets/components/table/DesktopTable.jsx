import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PriorityBadge from "@/features/tickets/components/badges/PriorityBadge";
import StatusBadge from "@/features/tickets/components/badges/StatusBadge";
import Remaining from "@/features/tickets/components/sla/Remaining";
import { CATEGORY_CODE_CONFIG } from "@/i18n/es/categoryConfig";

export default function DesktopTable({ tickets, resume }) {
  return (
    <Table>
      <TableHeader className="bg-muted-foreground/5">
        <TableRow>
          <TableHead className="text-muted-foreground w-6/19 text-center text-xs font-bold">
            ID & TITULO
          </TableHead>
          {resume === false && (
            <TableHead className="text-muted-foreground w-3/19 text-center text-xs font-bold">
              SOLICITANTE
            </TableHead>
          )}
          <TableHead className="text-muted-foreground w-3/19 text-center text-xs font-bold">
            CATEGORÍA
          </TableHead>
          <TableHead className="text-muted-foreground w-2/19 text-center text-xs font-bold">
            PRIORIDAD
          </TableHead>
          <TableHead className="text-muted-foreground w-2/19 text-center text-xs font-bold">
            SLA RESTANTE
          </TableHead>
          <TableHead className="text-muted-foreground w-2/19 text-center text-xs font-bold">
            ESTADO
          </TableHead>
          <TableHead className="text-muted-foreground w-1/19 text-center text-xs font-bold">
            ACCIÓN
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id} className="hover:bg-muted-foreground/10">
            <TableCell className="pl-4 font-medium">
              <div className="flex flex-col">
                <Link
                  to={`/tickets/${ticket.id}`}
                  state={{ ticket }}
                  className="text-primary focus-visible:ring-ring rounded-sm font-semibold underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
                >
                  {ticket.codigo}
                </Link>
                <Link
                  to={`/tickets/${ticket.id}`}
                  state={{ ticket }}
                  className="focus-visible:ring-ring rounded-sm hover:underline focus-visible:ring-2 focus-visible:outline-none"
                >
                  {ticket.title}
                </Link>
              </div>
            </TableCell>
            {resume === false && (
              <TableCell className="text-center">
                {ticket.createdByName}
              </TableCell>
            )}
            <TableCell className="text-center">
              {CATEGORY_CODE_CONFIG[ticket.category]?.label || ticket.category}
            </TableCell>
            <TableCell className="flex justify-center">
              <PriorityBadge priority={ticket.priority} className="mt-1" />
            </TableCell>
            <TableCell className="text-center">
              <Remaining slaDueAt={ticket.slaDueAt} status={ticket.status} />
            </TableCell>
            <TableCell className="text-center">
              <StatusBadge status={ticket.grupoEstado} className="mt-1" />
            </TableCell>
            <TableCell className="flex justify-center">
              {" "}
              <Link
                to={`/tickets/${ticket.id}`}
                state={{ ticket }}
                aria-label={`Ver detalles de ${ticket.codigo}`}
              >
                <ChevronRight aria-hidden="true" />
              </Link>{" "}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
