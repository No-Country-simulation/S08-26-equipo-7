import { Check, ChevronRight, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function ActionCell({ ticket, onApprove, onReject, mobileView = false }) { 
  const [isProcessing, setIsProcessing] = useState(false);
  const [resolvedStatus, setResolvedStatus] = useState(null);
  const location = useLocation();

  const executeAction = async (actionFn, statusMarker) => {
    setIsProcessing(true);
    try {
      await actionFn(ticket.id);
      setResolvedStatus(statusMarker);
    } catch (error) {
      console.error(error);
      setIsProcessing(false); 
    }
  };

  if (!onApprove || !onReject) {
    return (
      <Link
        to={`/tickets/${ticket.id}`}
        state={{ ticket, from: location.pathname }}
        aria-label={`Ver detalles de ${ticket.codigo}`}
      >
        {mobileView ? (<span className="text-primary text-xs sm:text-sm">Ver Detalle</span>) : (<ChevronRight aria-hidden="true" className="size-4" />)}
      </Link>
    );
  }

  if (resolvedStatus === 'APPROVED') {
    return (
      <span className="inline-flex items-center rounded-md bg-success/10 px-2.5 py-1 text-xs font-semibold text-success border border-success/20">
        Aprobado
      </span>
    );
  }

  if (resolvedStatus === 'REJECTED') {
    return (
      <span className="inline-flex items-center rounded-md bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive border border-destructive/20">
        Rechazado
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        className="h-8 w-8 p-0 text-success bg-card border border-success/20 hover:bg-success hover:text-white transition-all duration-300"
        onClick={() => executeAction(onApprove, 'APPROVED')}
        disabled={isProcessing}
        title="Aprobar"
      >
        {isProcessing ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0 text-destructive! bg-card! border! border-destructive/20! hover:bg-destructive! hover:text-white! transition-all! duration-300!"
        onClick={() => executeAction(onReject, 'REJECTED')}
        disabled={isProcessing}
        title="Rechazar"
      >
        {isProcessing ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
      </Button>
      
      <Link
        to={`/tickets/${ticket.id}`}
        state={{ ticket, from: location.pathname }}
        className={`ml-1 inline-flex items-center ${isProcessing ? 'pointer-events-none opacity-50' : 'text-muted-foreground hover:text-primary'}`}
        aria-label={`Ver detalles de ${ticket.codigo}`}
      >
        {mobileView ? (<span className="text-primary text-xs sm:text-sm">Ver Detalle</span>) : (<ChevronRight aria-hidden="true" className="size-4" />)}
      </Link>
    </div>
  );
}