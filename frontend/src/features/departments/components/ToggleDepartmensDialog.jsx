import { Loader2, Power } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDepartmens } from "@/features/departments/context/DepartmensProvider";

export default function ToggleDepartmensDialog() {
  const { toggleTarget, closeToggle, confirmToggle, isToggling } =
    useDepartmens();

  const willDeactivate = Boolean(toggleTarget?.active);

  return (
    <AlertDialog
      open={Boolean(toggleTarget)}
      onOpenChange={(open) => {
        if (!open) closeToggle();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia
            className={
              willDeactivate ? "bg-destructive/10" : "bg-success/10"
            }
          >
            <Power
              className={willDeactivate ? "text-destructive" : "text-success"}
            />
          </AlertDialogMedia>
          <AlertDialogTitle>
            {willDeactivate
              ? "¿Desactivar este departamento?"
              : "¿Activar este departamento?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {willDeactivate
              ? `${toggleTarget?.name} dejará de aparecer al crear solicitudes. Los tickets existentes no se modifican.`
              : `${toggleTarget?.name} volverá a estar disponible para nuevas solicitudes.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isToggling}>Cancelar</AlertDialogCancel>
          <Button
            variant={willDeactivate ? "destructive" : "default"}
            onClick={confirmToggle}
            disabled={isToggling}
          >
            {isToggling ? (
              <>
                <Loader2 className="animate-spin" />
                Aplicando...
              </>
            ) : willDeactivate ? (
              "Desactivar"
            ) : (
              "Activar"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
