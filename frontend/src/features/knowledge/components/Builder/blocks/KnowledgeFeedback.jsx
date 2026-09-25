import { ThumbsDown,ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import CreateDialog from "@/features/tickets/components/dialogs/CreateDialog";

export default function KnowledgeFeedback({ megusta = 0, nomegusta = 0 }) {
  const totalVotes = megusta + nomegusta;
  const satisfaccion = totalVotes > 0 ? Math.round((megusta / totalVotes) * 100) : 0;

  return (
    <div className="bg-card border-border rounded-lg border px-6 py-5 shadow-md flex flex-col sm:flex-row items-center justify-between space-y-2">
      <div className="flex flex-col">
        <p className="font-semibold text-sm">¿Resolvió su requerimiento?</p>
        <p className="text-muted-foreground/70 text-xs">
          {satisfaccion}% efectividad ({totalVotes} votos confirmados)
        </p>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" className="bg-muted cursor-pointer gap-1">
          <ThumbsUp className="text-success" size={14} /> Sí
        </Button>
        <CreateDialog
          trigger={
            <Button variant="outline" size="sm" className="bg-muted cursor-pointer gap-1">
              <ThumbsDown className="text-destructive" size={14} /> Ticket
            </Button>
          }
        />
      </div>
    </div>
  );
}