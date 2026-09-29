import { Check, Clipboard, KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUsers } from "@/features/users/context/UsersContext";

const TOAST_CLASS = "bg-foreground! dark:bg-background! text-white!";

export default function ChangePasswordDialog() {
  const { passwordTarget, closePasswordDialog, confirmPasswordChange, isChangingPassword } = useUsers();
  const [hasError, setHasError] = useState(false);
  const password = passwordTarget?.generatedPassword;

  async function handleConfirm() {
    setHasError(false);
    const result = await confirmPasswordChange();
    if (!result?.ok) setHasError(true);
  }

  async function copyPassword() {
    try {
      await navigator.clipboard.writeText(password);
      toast.success("Contraseña copiada", { className: TOAST_CLASS });
    } catch {
      toast.error("No se pudo copiar", {
        description: "Selecciona y copia la contraseña manualmente.",
        className: TOAST_CLASS,
      });
    }
  }

  function handleOpenChange(open) {
    if (!open && !isChangingPassword) {
      setHasError(false);
      closePasswordDialog();
    }
  }

  return (
    <Dialog open={Boolean(passwordTarget)} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={!isChangingPassword}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {password ? <Check aria-hidden="true" className="text-emerald-600 size-5" /> : <KeyRound aria-hidden="true" className="text-primary size-5" />}
            {password ? "Contraseña renovada" : "Renovar contraseña"}
          </DialogTitle>
          <DialogDescription>
            {password
              ? `La nueva contraseña temporal de ${passwordTarget?.name} se muestra una sola vez. Compártela por un canal seguro.`
              : `¿Quieres generar una nueva contraseña temporal para ${passwordTarget?.name}? La contraseña actual dejará de funcionar.`}
          </DialogDescription>
        </DialogHeader>

        {password ? (
          <div className="space-y-2">
            <Label htmlFor="renewed-password">Nueva contraseña temporal</Label>
            <div className="flex gap-2">
              <Input id="renewed-password" value={password} readOnly className="font-mono tracking-widest" />
              <Button type="button" variant="outline" className="h-11 rounded-md" onClick={copyPassword} aria-label="Copiar nueva contraseña">
                <Clipboard aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Copiar</span>
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">Por seguridad, cierra este diálogo después de guardar o compartir la contraseña.</p>
          </div>
        ) : null}

        {hasError ? <p className="text-destructive text-sm" role="status">No se completó el cambio. Puedes volver a intentarlo.</p> : null}

        <DialogFooter>
          {password ? (
            <Button className="btn-gradient-primary rounded-md" onClick={() => { setHasError(false); closePasswordDialog(); }}>Listo</Button>
          ) : (
            <>
              <DialogClose asChild><Button variant="outline" className="h-11 rounded-md" disabled={isChangingPassword}>Cancelar</Button></DialogClose>
              <Button className="btn-gradient-primary rounded-md" onClick={handleConfirm} disabled={isChangingPassword}>
                {isChangingPassword ? <><Loader2 aria-hidden="true" className="animate-spin" /> Renovando...</> : "Sí, renovar contraseña"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
