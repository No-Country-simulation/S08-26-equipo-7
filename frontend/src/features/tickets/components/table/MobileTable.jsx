import React from "react";
import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import PriorityBadge from "@/features/tickets/components/badges/PriorityBadge";
import StatusBadge from "@/features/tickets/components/badges/StatusBadge";
import Remaining from "@/features/tickets/components/sla/Remaining";
import { CATEGORY_CODE_CONFIG } from "@/i18n/es/categoryConfig";

export default function MobileTable({ tickets, resume }) {
  return(
    <Table>
      <TableBody className="border border-border ">
        {tickets.map((ticket) => (
          <React.Fragment key={ticket.id}>
            <TableRow
              key={`${ticket.id}-title`}
            >
              <TableCell className="bg-muted-foreground/10 text-muted-foreground font-bold text-xs w-1/4 whitespace-normal">ID & TITULO</TableCell>
              <TableCell className="whitespace-normal wrap-break-words">
                <div className="flex flex-col">
                  <Link to={`/tickets/${ticket.id}`} className="rounded-sm text-primary font-semibold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {ticket.codigo}
                  </Link>
                  <Link to={`/tickets/${ticket.id}`} className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {ticket.title}
                  </Link>
                </div>
              </TableCell>
            </TableRow>
            {resume === false && (
              <TableRow key={`${ticket.id}-creator`}>
                <TableCell className="bg-muted-foreground/10 text-muted-foreground font-bold text-xs w-1/4 whitespace-normal">SOLICITANTE</TableCell>
                <TableCell className="w-3/4 whitespace-normal wrap-break-words">{ticket.createdByName}</TableCell>
              </TableRow>
            )}
            <TableRow key={`${ticket.id}-category`}>
              <TableCell className="bg-muted-foreground/10 text-muted-foreground font-bold text-xs w-1/4 whitespace-normal">CATEGORÍA</TableCell>
              <TableCell className="w-3/4 whitespace-normal wrap-break-words">{CATEGORY_CODE_CONFIG[ticket.category]?.label || ticket.category}</TableCell>
            </TableRow>
            <TableRow key={`${ticket.id}-priority`}>
              <TableCell className="bg-muted-foreground/10 text-muted-foreground font-bold text-xs w-1/4 whitespace-normal">PRIORIDAD</TableCell>
              <TableCell className="w-3/4 whitespace-normal wrap-break-words"><PriorityBadge priority={ticket.priority} /></TableCell>
            </TableRow>
            <TableRow key={`${ticket.id}-sla`}>
              <TableCell className="bg-muted-foreground/10 text-muted-foreground font-bold text-xs w-1/4 whitespace-normal">SLA RESTANTE</TableCell>
              <TableCell className="w-3/4 whitespace-normal wrap-break-words">
                <Remaining slaDueAt={ticket.slaDueAt} status={ticket.status} />
              </TableCell>
            </TableRow>
            <TableRow key={`${ticket.id}-status`}>
              <TableCell className="bg-muted-foreground/10 text-muted-foreground font-bold text-xs w-1/4 whitespace-normal">ESTADO</TableCell>
              <TableCell className="w-3/4 whitespace-normal wrap-break-words"><StatusBadge status={ticket.status} /></TableCell>
            </TableRow>
            <TableRow key={`${ticket.id}-details`}>
              <TableCell className="bg-muted-foreground/10 text-muted-foreground font-bold text-xs w-1/4 whitespace-normal border-b-4 border-border">ACCIÓN</TableCell>
              <TableCell className="w-3/4 whitespace-normal wrap-break-words text-primary border-b-4 border-border"><Link to={`/tickets/${ticket.id}`}>Ver detalles</Link></TableCell>
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};