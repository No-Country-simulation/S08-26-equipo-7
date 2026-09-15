import { ChevronRight } from "lucide-react";
import { useEffect,useState } from 'react';

import { useSlaCountdown } from "@/components/SlaCountdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTickets } from "@/features/tickets/services/ticketApi";

import TicketPriorityBadge from "./TicketPriorityBadge";

function SlaRemaining({ slaDueAt }) {
  const { timeLeft, isExpired, difference } = useSlaCountdown(slaDueAt);
  const isWarning = 20 * 60 * 60 * 1000;

  return (
    <span className={isExpired ? "text-destructive" : difference < isWarning ? "text-warning" : "text-muted-foreground"}>
      {isExpired ? `Vencido (${timeLeft})` : difference < isWarning ? `Por vencer (${timeLeft})` : timeLeft}
    </span>
  );
}

export default function TicketsTable({ limit, offset }) {
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
          <TableHead className="text-muted-foreground font-bold text-xs text-center w-3/19">SOLICITANTE</TableHead>
          <TableHead className="text-muted-foreground font-bold text-xs text-center w-3/19">CATEGORÍA</TableHead>
          <TableHead className="text-muted-foreground font-bold text-xs text-center w-2/19">PRIORIDAD</TableHead>
          <TableHead className="text-muted-foreground font-bold text-xs text-center w-2/19">SLA RESTANTE</TableHead>
          <TableHead className="text-muted-foreground font-bold text-xs text-center w-2/19">ESTADO</TableHead>
          <TableHead className="text-muted-foreground font-bold text-xs text-center w-1/19">ACCIÓN</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id} className="hover:bg-muted-foreground/10">
            <TableCell className="font-medium pl-4">
              <div className="flex flex-col">
                <span className="text-primary font-semibold">{ticket.id}</span>
                <span>{ticket.title}</span>
              </div>
            </TableCell>
            <TableCell></TableCell>
            <TableCell className="text-center">{ticket.category}</TableCell>
            <TableCell className="flex justify-center"><TicketPriorityBadge priority={ticket.priority} /></TableCell>
            <TableCell className="text-center">
              <SlaRemaining slaDueAt={ticket.slaDueAt} />
            </TableCell>
            <TableCell className="text-center">{ticket.status}</TableCell>
            <TableCell className="flex justify-center"> <ChevronRight /> </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};