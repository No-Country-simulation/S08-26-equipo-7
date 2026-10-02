import { Check, Clipboard, Loader2, UserPlus, UserRoundPen } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUsers } from "@/features/users/context/UsersContext";
import { getRoleLabel } from "@/i18n/es/roles";

const ROLE_OPTIONS = ["ADMIN", "AGENT", "SUPERVISOR", "REQUESTER"];
const NO_AREA = "__none__";
const TOAST_CLASS = "bg-foreground! dark:bg-background! text-white!";

function initialValues(user) {
  return {
    name: user?.name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "REQUESTER",
    area: user?.area ?? "",
  };
}

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "El nombre es obligatorio.";
  if (!values.email.trim()) errors.email = "El correo electrónico es obligatorio.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Escribe un correo electrónico válido.";
  }
  if (!ROLE_OPTIONS.includes(values.role)) errors.role = "Selecciona un rol válido.";
  const areaRequired = !["ADMIN", "REQUESTER"].includes(values.role);
  if (areaRequired && !values.area) {
    errors.area = "Selecciona un área para este rol.";
  }
  return errors;
}

function UserForm({ user, departments, departmentError, isSaving, onSubmit, credentials, onRetryDepartments }) {
  const formId = useId();
  const [values, setValues] = useState(() => initialValues(user));
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(user);
  const areaRequired = !["ADMIN", "REQUESTER"].includes(values.role);
  const availableAreas = departments.filter(
    (department) => department.active || department.code === user?.area,
  );

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      if (field === "role" && value === "REQUESTER") delete next.area;
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const result = await onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      role: values.role,
      area: values.area || null,
    });

    if (result?.ok) return;
    if (result?.error?.status === 409) {
      setErrors((current) => ({ ...current, email: "Este correo ya está registrado." }));
    } else if (result?.error?.status === 422 && /email/i.test(result.error.message)) {
      setErrors((current) => ({ ...current, email: result.error.message }));
    }
  }

  async function copyPassword() {
    try {
      await navigator.clipboard.writeText(credentials.password);
      toast.success("Contraseña copiada", { className: TOAST_CLASS });
    } catch {
      toast.error("No se pudo copiar", {
        description: "Selecciona y copia la contraseña manualmente.",
        className: TOAST_CLASS,
      });
    }
  }

  if (credentials) {
    return (
      <div className="space-y-4">
        <div className="bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 rounded-lg p-4" role="status">
          <p className="flex items-center gap-2 font-semibold"><Check aria-hidden="true" className="size-4" /> Cuenta creada correctamente</p>
          <p className="mt-1 text-sm">Comparte la contraseña temporal con {credentials.name} por un canal seguro. No volverá a mostrarse al cerrar este diálogo.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${formId}-generated-password`}>Contraseña temporal</Label>
          <div className="flex gap-2">
            <Input id={`${formId}-generated-password`} readOnly value={credentials.password} className="font-mono tracking-widest" />
            <Button type="button" variant="outline" className="h-11 rounded-md" onClick={copyPassword} aria-label="Copiar contraseña temporal">
              <Clipboard aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Copiar</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <form id={formId} onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor={`${formId}-name`}>Nombre completo <span aria-hidden="true">*</span></Label>
          <Input id={`${formId}-name`} name="name" autoComplete="name" maxLength={120} value={values.name} disabled={isSaving} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${formId}-name-error` : undefined} onChange={(event) => updateField("name", event.target.value)} />
          <FieldError id={`${formId}-name-error`} errors={errors.name} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${formId}-email`}>Correo electrónico <span aria-hidden="true">*</span></Label>
          <Input id={`${formId}-email`} name="email" type="email" autoComplete="email" maxLength={254} value={values.email} disabled={isEditing || isSaving} readOnly={isEditing} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${formId}-email-error` : isEditing ? `${formId}-email-help` : undefined} onChange={(event) => updateField("email", event.target.value)} />
          {errors.email ? <FieldError id={`${formId}-email-error`} errors={errors.email} /> : isEditing ? <p id={`${formId}-email-help`} className="text-muted-foreground text-xs">El correo no se puede modificar.</p> : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={`${formId}-role`}>Rol <span aria-hidden="true">*</span></Label>
            <Select value={values.role} onValueChange={(value) => updateField("role", value)} disabled={isSaving}>
              <SelectTrigger id={`${formId}-role`} aria-label="Rol del usuario" aria-invalid={Boolean(errors.role)} className="h-11 w-full rounded-md border border-border"><SelectValue placeholder="Selecciona un rol" /></SelectTrigger>
              <SelectContent>{ROLE_OPTIONS.map((role) => <SelectItem key={role} value={role}>{getRoleLabel(role)}</SelectItem>)}</SelectContent>
            </Select>
            <FieldError errors={errors.role} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${formId}-area`}>
              Área / departamento {areaRequired ? <span aria-hidden="true">*</span> : null}
              {!areaRequired ? <span className="text-muted-foreground text-xs font-normal"> (opcional)</span> : null}
            </Label>
            <Select value={values.area || NO_AREA} onValueChange={(value) => updateField("area", value === NO_AREA ? "" : value)} disabled={isSaving}>
              <SelectTrigger id={`${formId}-area`} aria-label="Área o departamento del usuario" aria-required={areaRequired} aria-invalid={Boolean(errors.area)} aria-describedby={errors.area ? `${formId}-area-error` : undefined} className="h-11 w-full min-w-0 rounded-md border border-border"><SelectValue placeholder="Selecciona un área" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_AREA}>Sin área asignada</SelectItem>
                {availableAreas.map((department) => <SelectItem key={department.code} value={department.code}>{department.name}</SelectItem>)}
                {values.area && !availableAreas.some((department) => department.code === values.area) ? <SelectItem value={values.area}>{values.area}</SelectItem> : null}
              </SelectContent>
            </Select>
            <FieldError id={`${formId}-area-error`} errors={errors.area} />
            {departmentError ? (
              <p className="text-muted-foreground text-xs" role="status">
                No se pudieron cargar las áreas. Vuelve a intentarlo antes de guardar un rol que las requiera.{" "}
                <button type="button" className="text-primary underline underline-offset-2" onClick={onRetryDepartments}>
                  Reintentar
                </button>
              </p>
            ) : null}
          </div>
        </div>
        {!isEditing ? <p className="text-muted-foreground text-xs">El sistema generará una contraseña temporal segura de 10 caracteres al crear la cuenta.</p> : null}
      </form>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline" className="h-11 rounded-md" disabled={isSaving}>Cancelar</Button></DialogClose>
        <Button type="submit" form={formId} className="btn-gradient-primary rounded-md" disabled={isSaving}>
          {isSaving ? <><Loader2 aria-hidden="true" className="animate-spin" /> Guardando...</> : isEditing ? "Guardar cambios" : "Crear usuario"}
        </Button>
      </DialogFooter>
    </>
  );
}

export default function UserFormDialog() {
  const { dialogOpen, selectedUser, departments, departmentError, createdCredentials, closeUserDialog, saveUser, isSaving, refresh } = useUsers();
  const isEditing = Boolean(selectedUser);

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeUserDialog(); }}>
      <DialogContent className="sm:max-w-lg" showCloseButton={!isSaving}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {isEditing ? <UserRoundPen aria-hidden="true" className="text-primary size-5" /> : <UserPlus aria-hidden="true" className="text-primary size-5" />}
            {createdCredentials ? "Usuario listo" : isEditing ? "Editar usuario" : "Nuevo usuario"}
          </DialogTitle>
          <DialogDescription>
            {createdCredentials ? "Guarda la contraseña temporal y compártela con el usuario." : isEditing ? "Actualiza el nombre, el rol o el área del usuario." : "Completa los datos. La contraseña se generará automáticamente al crear la cuenta."}
          </DialogDescription>
        </DialogHeader>
        {dialogOpen ? <UserForm key={selectedUser?.id ?? (createdCredentials ? "created" : "new")} user={selectedUser} departments={departments} departmentError={departmentError} isSaving={isSaving} onSubmit={saveUser} credentials={createdCredentials} onRetryDepartments={refresh} /> : null}
        {createdCredentials ? <DialogFooter><Button className="btn-gradient-primary rounded-md" onClick={closeUserDialog}>Listo</Button></DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
}
