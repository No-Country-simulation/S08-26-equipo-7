import { FilePlus, Plus } from "lucide-react";

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
  return (
    <div>
      <Dialog>
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
          <CreateTicketForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
