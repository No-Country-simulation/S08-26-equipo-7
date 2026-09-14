import { ArrowLeftIcon, FilePlus, Plus } from "lucide-react";
import { useState } from "react";

import StatusCard from "@/components/StatusCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CreateTicketForm from "./CreateTicketForm";

export default function CreateRequestDialog() {
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  function handleOpenChange(nextOpen) {
    setOpen(nextOpen);
    if (!nextOpen) setShowSuccess(false);
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            className="btn-gradient-primary h-8! w-8! cursor-pointer overflow-hidden rounded-md! p-0! sm:h-9! sm:w-auto! sm:px-3! md:h-10! md:px-6!"
            size="icon-xs"
            aria-label="Nueva solicitud"
            title="Nueva solicitud"
          >
            <Plus />
            <span className="hidden sm:inline">Nueva Solicitud</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg md:max-w-xl">
          {showSuccess ? (
            <StatusCard
              title="¡Solicitud enviada!"
              message="Tu solicitud ha sido enviada correctamente."
              action={
                <button
                  type="button"
                  onClick={() => setShowSuccess(false)}
                  className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-base text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Crear otra solicitud
                </button>
              }
            />
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center text-xl">
                  <div className="mr-4 hidden w-auto items-center justify-center rounded-md bg-success/15 p-1 sm:inline">
                    <FilePlus className="hidden min-h-7.5 min-w-7.5 text-success sm:inline" />
                  </div>
                  Crear Nueva Solicitud Interna
                </DialogTitle>
                <DialogDescription>
                  Completa los datos para registrar una nueva solicitud interna.
                </DialogDescription>
              </DialogHeader>
              <CreateTicketForm onSuccess={() => setShowSuccess(true)} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
