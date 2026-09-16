import { ChevronRight } from "lucide-react";
import { useEffect,useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTickets } from "@/features/tickets/services/ticketApi";
import { CATEGORY_CODE_CONFIG } from "@/i18n/es/categoryConfig";

import SlaRemaining from "./SlaRemaining";
import TicketPriorityBadge from "./TicketPriorityBadge";
import TicketStatusBadge from "./TicketStatusBadge";

export default function TicketsTableDesktop({ limit, offset, resume }) {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    async function fetchTickets() {
      const data = await getTickets(limit, offset);
      setTickets(data.items);
    }
    fetchTickets();
  }, [limit, offset]);

  return (
    <Table>
      <TableHeader className="bg-muted-foreground/10">
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
            className="hover:bg-muted-foreground/10 cursor-pointer"
            onClick={() => navigate(`/tickets/${ticket.id}`)}
          >
            <TableCell className="font-medium pl-4">
              <div className="flex flex-col">
                <span className="text-primary font-semibold">{ticket.codigo}</span>
                <span>{ticket.title}</span>
              </div>
            </TableCell>
            {resume === false && <TableCell>{ticket.createdByName}</TableCell>}
            <TableCell className="text-center">{CATEGORY_CODE_CONFIG[ticket.category]?.label || ticket.category}</TableCell>
            <TableCell className="flex justify-center"><TicketPriorityBadge priority={ticket.priority} /></TableCell>
            <TableCell className="text-center">
              <SlaRemaining slaDueAt={ticket.slaDueAt} />
            </TableCell>
            <TableCell className="text-center"><TicketStatusBadge status={ticket.status} /></TableCell>
            <TableCell className="flex justify-center"> <Link to={`/tickets/${ticket.id}`}><ChevronRight /></Link> </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};