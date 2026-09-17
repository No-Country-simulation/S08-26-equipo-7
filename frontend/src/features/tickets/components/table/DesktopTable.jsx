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

export default function DesktopTable({ tickets , resume }) {
  return (
    <Table>
      <TableHeader className="bg-muted-foreground/5">
        <TableRow >
          <TableHead className="text-muted-foreground font-bold text-xs text-center w-6/19">ID & TITULO</TableHead>
          {resume === false && <TableHead className="text-muted-foreground font-bold text-xs text-center w-3/19">SOLICITANTE</TableHead>}
          <TableHead className="text-muted-foreground font-bold text-xs text-center w-3/19">CATEGORÍA</TableHead>
          <TableHead className="text-muted-foreground font-bold text-xs text-center w-2/19">PRIORIDAD</TableHead>
          <TableHead className="text-muted-foreground font-bold text-xs text-center w-2/19">SLA RESTANTE</TableHead>
          <TableHead className="text-muted-foreground font-bold text-xs text-center w-2/19">ESTADO</TableHead>
          <TableHead className="text-muted-foreground font-bold text-xs text-center w-1/19">ACCIÓN</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow
            key={ticket.id}
            className="hover:bg-muted-foreground/10"
          >
            <TableCell className="font-medium pl-4">
              <div className="flex flex-col">
                <Link to={`/tickets/${ticket.id}`} className="rounded-sm text-primary font-semibold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {ticket.codigo}
                </Link>
                <Link to={`/tickets/${ticket.id}`} className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {ticket.title}
                </Link>
              </div>
            </TableCell>
            {resume === false && <TableCell className="text-center">{ticket.createdByName}</TableCell>}
            <TableCell className="text-center">{CATEGORY_CODE_CONFIG[ticket.category]?.label || ticket.category}</TableCell>
            <TableCell className="flex justify-center"><PriorityBadge priority={ticket.priority} /></TableCell>
            <TableCell className="text-center">
              <Remaining slaDueAt={ticket.slaDueAt} status={ticket.status} />
            </TableCell>
            <TableCell className="text-center"><StatusBadge status={ticket.status} /></TableCell>
            <TableCell className="flex justify-center"> <Link to={`/tickets/${ticket.id}`} aria-label={`Ver detalles de ${ticket.codigo}`}><ChevronRight aria-hidden="true" /></Link> </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};