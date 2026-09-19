import React from "react";
import { Link } from "react-router-dom";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import PriorityBadge from "@/features/tickets/components/badges/PriorityBadge";
import StatusBadge from "@/features/tickets/components/badges/StatusBadge";
import Remaining from "@/features/tickets/components/sla/Remaining";
import { CATEGORY_CODE_CONFIG } from "@/i18n/es/categoryConfig";

export default function MobileTable({ tickets, resume }) {
  return (
    <Table>
      <TableBody className="border-border border">
        {tickets.map((ticket) => (
          <React.Fragment key={ticket.id}>
            <TableRow key={`${ticket.id}-title`}>
              <TableCell className="bg-muted-foreground/5 text-muted-foreground w-1/4 text-xs font-bold whitespace-normal">
                ID & TITULO
              </TableCell>
              <TableCell className="wrap-break-words whitespace-normal">
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
            </TableRow>
            {resume === false && (
              <TableRow key={`${ticket.id}-creator`}>
                <TableCell className="bg-muted-foreground/5 text-muted-foreground w-1/4 text-xs font-bold whitespace-normal">
                  SOLICITANTE
                </TableCell>
                <TableCell className="wrap-break-words w-3/4 whitespace-normal">
                  {ticket.createdByName}
                </TableCell>
              </TableRow>
            )}
            <TableRow key={`${ticket.id}-category`}>
              <TableCell className="bg-muted-foreground/5 text-muted-foreground w-1/4 text-xs font-bold whitespace-normal">
                CATEGORÍA
              </TableCell>
              <TableCell className="wrap-break-words w-3/4 whitespace-normal">
                {CATEGORY_CODE_CONFIG[ticket.category]?.label ||
                  ticket.category}
              </TableCell>
            </TableRow>
            <TableRow key={`${ticket.id}-priority`}>
              <TableCell className="bg-muted-foreground/5 text-muted-foreground w-1/4 text-xs font-bold whitespace-normal">
                PRIORIDAD
              </TableCell>
              <TableCell className="wrap-break-words w-3/4 whitespace-normal">
                <PriorityBadge priority={ticket.priority} className="mt-1" />
              </TableCell>
            </TableRow>
            <TableRow key={`${ticket.id}-sla`}>
              <TableCell className="bg-muted-foreground/5 text-muted-foreground w-1/4 text-xs font-bold whitespace-normal">
                SLA RESTANTE
              </TableCell>
              <TableCell className="wrap-break-words w-3/4 whitespace-normal">
                <Remaining slaDueAt={ticket.slaDueAt} status={ticket.status} />
              </TableCell>
            </TableRow>
            <TableRow key={`${ticket.id}-status`}>
              <TableCell className="bg-muted-foreground/5 text-muted-foreground w-1/4 text-xs font-bold whitespace-normal">
                ESTADO
              </TableCell>
              <TableCell className="wrap-break-words w-3/4 whitespace-normal">
                <StatusBadge status={ticket.grupoEstado} className="mt-1" />
              </TableCell>
            </TableRow>
            <TableRow key={`${ticket.id}-details`}>
              <TableCell className="bg-muted-foreground/5 text-muted-foreground border-border w-1/4 border-b-4 text-xs font-bold whitespace-normal">
                ACCIÓN
              </TableCell>
              <TableCell className="wrap-break-words text-primary border-border w-3/4 border-b-4 whitespace-normal">
                <Link to={`/tickets/${ticket.id}`} state={{ ticket }}>
                  Ver detalles
                </Link>
              </TableCell>
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
