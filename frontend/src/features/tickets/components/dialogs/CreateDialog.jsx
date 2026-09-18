import { ArrowLeftIcon, FilePlus, Plus } from "lucide-react";
import { useState } from "react";

import SuccessCard from "@/components/SuccessCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CreateForm from "../forms/CreateForm";

export default function CreateDialog() {
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
            className="btn-gradient-primary h-8! w-auto! cursor-pointer overflow-hidden rounded-md! p-1! sm:h-9! sm:px-3! md:h-10! md:px-4! xl:px-6!"
            size="icon-xs"
            aria-label="Nueva solicitud"
            title="Nueva solicitud"
          >
            <Plus className="size-3 md:size-4 xl:size-6" />
            <span className="ml-1 text-xs md:text-sm xl:text-base">
              Nueva Solicitud
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg md:max-w-xl">
          {showSuccess ? (
            <SuccessCard
              title="¡Solicitud enviada!"
              message="Tu solicitud ha sido enviada correctamente."
              action={
                <button
                  type="button"
                  onClick={() => setShowSuccess(false)}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-base"
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
                  <div className="bg-success/15 mr-4 hidden w-auto items-center justify-center rounded-md p-1 sm:inline">
                    <FilePlus className="text-success hidden min-h-7.5 min-w-7.5 sm:inline" />
                  </div>
                  Crear Nueva Solicitud Interna
                </DialogTitle>
                <DialogDescription>
                  Completa los datos para registrar una nueva solicitud interna.
                </DialogDescription>
              </DialogHeader>
              <CreateForm onSuccess={() => setShowSuccess(true)} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
