import { ArrowLeftIcon, FilePlus, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import SuccessCard from "@/components/SuccessCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

export default function CreateDialog({ trigger }) {
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formInstance, setFormInstance] = useState(0);

  const closeDialog = useCallback(() => {
    if (showSuccess) {
      window.dispatchEvent(new Event("ticket-created"));
    }
    setOpen(false);
    setShowSuccess(false);
    setShowDiscardConfirmation(false);
    setIsDirty(false);
    setFormInstance((current) => current + 1);
  }, [showSuccess]);

  const handleOpenChange = useCallback(
    (nextOpen) => {
      if (nextOpen) {
        setOpen(true);
        return;
      }

      if (isSubmitting) return;
      if (isDirty && !showSuccess) {
        setShowDiscardConfirmation(true);
        return;
      }

      closeDialog();
    },
    [closeDialog, isDirty, isSubmitting, showSuccess],
  );

  const handleSuccess = useCallback(() => {
    setIsDirty(false);
    setShowSuccess(true);
  }, []);

  useEffect(() => {
    if (!open || !isDirty || showSuccess) return undefined;

    function warnBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [isDirty, open, showSuccess]);

  return (
    <div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {trigger ?? (
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
          )}
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-lg md:max-w-xl"
          onEscapeKeyDown={(event) => {
            if (isSubmitting) event.preventDefault();
          }}
          onPointerDownOutside={(event) => {
            if (isSubmitting) event.preventDefault();
          }}
        >
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
              <CreateForm
                key={formInstance}
                onSuccess={handleSuccess}
                onDraftChange={setIsDirty}
                onPendingChange={setIsSubmitting}
                onCancel={() => handleOpenChange(false)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={showDiscardConfirmation}
        onOpenChange={setShowDiscardConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Descartar esta solicitud?</AlertDialogTitle>
            <AlertDialogDescription>
              Se perderán el área, el título y la descripción que escribiste.
              Puedes seguir editando o descartar el borrador.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-11 rounded-md">
              Seguir editando
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              className="h-11 rounded-md"
              onClick={closeDialog}
            >
              Descartar solicitud
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
