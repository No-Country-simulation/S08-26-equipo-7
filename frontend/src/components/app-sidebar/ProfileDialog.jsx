import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UserAvatar from "@/features/users/components/UserAvatar";
import { changePassword } from "@/features/users/service/usersApi";
import { getRoleLabel } from "@/i18n/es/roles";

const TOAST_CLASS = "bg-foreground! dark:bg-background! text-white!";

export default function ProfileDialog({ open, onOpenChange, user }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  function handleOpenChange(nextOpen, force = false) {
    if (!nextOpen && isSaving && !force) return;
    if (!nextOpen) {
      setCurrentPassword("");
      setNewPassword("");
      setError("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
    }
    onOpenChange(nextOpen);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!currentPassword) {
      setError("Ingresa tu contraseña actual.");
      return;
    }
    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("La nueva contraseña debe ser diferente a la actual.");
      return;
    }

    setIsSaving(true);
    try {
      await changePassword({ currentPassword, newPassword });
      toast.success("Contraseña actualizada correctamente.", {
        className: TOAST_CLASS,
      });
      handleOpenChange(false, true);
    } catch (requestError) {
      setError(requestError?.message || "No se pudo actualizar la contraseña.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-xl" showCloseButton={!isSaving}>
        <DialogHeader className="border-b px-6 py-5 pr-12">
          <DialogTitle className="text-lg font-semibold">
            Mi Perfil y Credenciales
          </DialogTitle>
          <DialogDescription className="sr-only">
            Consulta tus datos y actualiza tu contraseña.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div className="flex min-w-0 items-center gap-4">
            <UserAvatar name={user?.nombre ?? "Usuario"} />
            <div className="min-w-0">
              <p className="truncate font-semibold">{user?.nombre ?? "Usuario"}</p>
              <p className="text-muted-foreground truncate text-sm">
                {user?.email ?? user?.correo ?? ""}
              </p>
              <span className="bg-primary/10 text-primary mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold">
                {getRoleLabel(user?.rol)}
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-muted-foreground mb-4 flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
              <KeyRound className="size-4" aria-hidden="true" />
              Cambiar contraseña
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-current-password">Contraseña actual</Label>
                <div className="relative">
                  <Input
                    id="profile-current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    disabled={isSaving}
                    className="pr-11"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 -translate-y-1/2 hover:scale-100"
                    onClick={() => setShowCurrentPassword((visible) => !visible)}
                    aria-label={showCurrentPassword ? "Ocultar contraseña actual" : "Mostrar contraseña actual"}
                    aria-pressed={showCurrentPassword}
                    disabled={isSaving}
                  >
                    {showCurrentPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-new-password">
                  Nueva contraseña (mínimo 8 caracteres)
                </Label>
                <div className="relative">
                  <Input
                    id="profile-new-password"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    disabled={isSaving}
                    className="pr-11"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 -translate-y-1/2 hover:scale-100"
                    onClick={() => setShowNewPassword((visible) => !visible)}
                    aria-label={showNewPassword ? "Ocultar nueva contraseña" : "Mostrar nueva contraseña"}
                    aria-pressed={showNewPassword}
                    disabled={isSaving}
                  >
                    {showNewPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          )}

          <DialogFooter className="-mx-6 -mb-5 rounded-b-xl border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-md"
              onClick={() => handleOpenChange(false)}
              disabled={isSaving}
            >
              Cerrar
            </Button>
            <Button
              type="submit"
              className="btn-gradient-primary h-10 rounded-md"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Guardando…
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
