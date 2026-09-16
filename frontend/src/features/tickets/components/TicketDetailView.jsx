import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function TicketDetailView({ ticket }) {
  return (
    <div className="w-full">
      <div className="p-4 bg-card rounded-lg my-4 flex border border-border shadow-md">

        <Link to="/tickets" className="mr-4">
          <Button variant="ghost" className="cursor-pointer text-secondary-foreground">
            <ArrowLeft />
            Volver al Listado
          </Button>
        </Link>
      </div>
      { ticket && (
        <div className="p-4 bg-card rounded-lg my-4 border border-border shadow-md">
          <h2 className="text-2xl font-bold mb-2">{ticket.title}</h2>
          <p className="text-muted-foreground">{ticket.description}</p>
        </div>
      )}
    </div>
  );
}