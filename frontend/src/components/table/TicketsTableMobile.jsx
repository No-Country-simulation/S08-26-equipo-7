import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import SlaRemaining from "@/features/tickets/components/SlaRemaining";
import TicketPriorityBadge from "@/features/tickets/components/TicketPriorityBadge";
import TicketStatusBadge from "@/features/tickets/components/TicketStatusBadge";
import { CATEGORY_CODE_CONFIG } from "@/i18n/es/categoryConfig";

export default function TicketsTableMobile({ tickets, resume }) {
  return(
    <Table>
      <TableBody className="border border-border">
        {tickets.map((ticket) => (
          <>
            <TableRow
              key={`${ticket.id}-title`}
              onClick={() => console.log(ticket)}
            >
              <TableCell className="bg-muted-foreground/10 text-muted-foreground font-bold text-xs w-1/4 whitespace-normal">ID & TITULO</TableCell>
              <TableCell className="whitespace-normal wrap-break-words">
                <div className="flex flex-col">
                  <span className="text-primary font-semibold">{ticket.codigo}</span>
                  <span>{ticket.title}</span>
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
              <TableCell className="w-3/4 whitespace-normal wrap-break-words"><TicketPriorityBadge priority={ticket.priority} /></TableCell>
            </TableRow>
            <TableRow key={`${ticket.id}-sla`}>
              <TableCell className="bg-muted-foreground/10 text-muted-foreground font-bold text-xs w-1/4 whitespace-normal">SLA RESTANTE</TableCell>
              <TableCell className="w-3/4 whitespace-normal wrap-break-words">
                <SlaRemaining slaDueAt={ticket.slaDueAt} />
              </TableCell>
            </TableRow>
            <TableRow key={`${ticket.id}-status`}>
              <TableCell className="bg-muted-foreground/10 text-muted-foreground font-bold text-xs w-1/4 whitespace-normal">ESTADO</TableCell>
              <TableCell className="w-3/4 whitespace-normal wrap-break-words"><TicketStatusBadge status={ticket.status} /></TableCell>
            </TableRow>
            <TableRow key={`${ticket.id}-details`}>
              <TableCell className="bg-muted-foreground/10 text-muted-foreground font-bold text-xs w-1/4 whitespace-normal border-b-4 border-border">ACCIÓN</TableCell>
              <TableCell className="w-3/4 whitespace-normal wrap-break-words text-primary border-b-4 border-border"><Link to={`/tickets/${ticket.id}`}>Ver detalles</Link></TableCell>
            </TableRow>
          </>
        ))}
      </TableBody>
    </Table>
  );
};