import { Building2, Loader2 } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDepartmens } from "@/features/departments/context/DepartmensProvider";

const MAX_CODE_LENGTH = 12;
const MAX_NAME_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 240;
const CODE_PATTERN = /^[A-Z0-9_-]+$/;

function getInitialForm(department) {
  if (!department) {
    return {
      code: "",
      name: "",
      description: "",
      requiresApproval: false,
    };
  }

  return {
    code: department.code ?? "",
    name: department.name ?? "",
    description: department.description ?? "",
    requiresApproval: Boolean(department.requiresApproval),
  };
}

function validateForm(values, isEditing) {
  const errors = {};

  if (!isEditing) {
    const code = values.code.trim().toUpperCase();
    if (!code) {
      errors.code = "El código es obligatorio";
    } else if (!CODE_PATTERN.test(code)) {
      errors.code = "Usa solo letras, números, guion o guion bajo";
    }
  }

  if (!values.name.trim()) {
    errors.name = "El nombre es obligatorio";
  }

  return errors;
}

function DepartmentForm({ department, isEditing, isSaving, onSubmit }) {
  const formId = useId();
  const [form, setForm] = useState(() => getInitialForm(department));
  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateForm(form, isEditing);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    await onSubmit({
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      description: form.description.trim(),
      requiresApproval: form.requiresApproval,
    });
  }

  return (
    <>
      <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="department-code" className="font-semibold">
            Código {!isEditing && <span aria-hidden="true">*</span>}
          </Label>
          <Input
            id="department-code"
            name="code"
            value={form.code}
            maxLength={MAX_CODE_LENGTH}
            placeholder="Ej. TI, RRHH, FIN"
            disabled={isEditing || isSaving}
            autoComplete="off"
            aria-invalid={Boolean(errors.code)}
            aria-describedby={
              errors.code ? "department-code-error" : "department-code-help"
            }
            onChange={(event) =>
              updateField("code", event.target.value.toUpperCase())
            }
          />
          <div className="flex items-start justify-between gap-2">
            {errors.code ? (
              <FieldError id="department-code-error" errors={errors.code} />
            ) : (
              <p
                id="department-code-help"
                className="text-muted-foreground text-xs"
              >
                {isEditing
                  ? "Identificador interno. No se puede modificar."
                  : "Se guarda en mayúsculas. Úsalo como referencia corta del área."}
              </p>
            )}
            {!isEditing && (
              <span className="text-muted-foreground text-xs">
                {form.code.length}/{MAX_CODE_LENGTH}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="department-name" className="font-semibold">
            Nombre <span aria-hidden="true">*</span>
          </Label>
          <Input
            id="department-name"
            name="name"
            value={form.name}
            maxLength={MAX_NAME_LENGTH}
            placeholder="Ej. Tecnología de la Información"
            disabled={isSaving}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "department-name-error" : undefined}
            onChange={(event) => updateField("name", event.target.value)}
          />
          <div className="flex items-start justify-between gap-2">
            <FieldError id="department-name-error" errors={errors.name} />
            <span className="text-muted-foreground ml-auto text-xs">
              {form.name.length}/{MAX_NAME_LENGTH}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="department-description" className="font-semibold">
            Descripción
          </Label>
          <Textarea
            id="department-description"
            name="description"
            value={form.description}
            maxLength={MAX_DESCRIPTION_LENGTH}
            placeholder="Qué cubre este departamento y cuándo usarlo"
            className="border-border min-h-24 resize-y"
            disabled={isSaving}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
          />
          <span className="text-muted-foreground ml-auto block text-right text-xs">
            {form.description.length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={form.requiresApproval}
          disabled={isSaving}
          onClick={() =>
            updateField("requiresApproval", !form.requiresApproval)
          }
          className="border-border hover:bg-muted/40 flex w-full items-start justify-between gap-4 rounded-lg border p-3 text-left transition-colors disabled:opacity-50"
        >
          <span>
            <span className="block text-sm font-semibold">
              Requiere aprobación
            </span>
            <span className="text-muted-foreground mt-0.5 block text-xs">
              Las solicitudes de este departamento deberán ser aprobadas antes
              de asignarse.
            </span>
          </span>
          <span
            className={`mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
              form.requiresApproval ? "bg-primary" : "bg-muted-foreground/30"
            }`}
          >
            <span
              className={`bg-background size-5 rounded-full shadow-sm transition-transform ${
                form.requiresApproval ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </span>
        </button>
      </form>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" className="py-5" disabled={isSaving}>
            Cancelar
          </Button>
        </DialogClose>
        <Button
          type="submit"
          form={formId}
          className="btn-gradient-primary"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin" />
              Guardando...
            </>
          ) : isEditing ? (
            "Guardar cambios"
          ) : (
            "Crear departamento"
          )}
        </Button>
      </DialogFooter>
    </>
  );
}

export default function ModalDepartmens() {
  const {
    modalOpen,
    closeModal,
    selectedDepartment,
    isEditing,
    saveDepartment,
    isSaving,
  } = useDepartmens();

  return (
    <Dialog
      open={modalOpen}
      onOpenChange={(open) => {
        if (!open && !isSaving) closeModal();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <div className="bg-primary/15 mr-3 hidden size-10 items-center justify-center rounded-md sm:inline-flex">
              <Building2 className="text-primary size-5" />
            </div>
            {isEditing ? "Editar departamento" : "Nuevo departamento"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza los datos del área. El código del sistema no se puede cambiar."
              : "Define el código, el nombre y si las solicitudes de esta área requieren aprobación."}
          </DialogDescription>
        </DialogHeader>

        {modalOpen ? (
          <DepartmentForm
            key={selectedDepartment?.id ?? "new"}
            department={selectedDepartment}
            isEditing={isEditing}
            isSaving={isSaving}
            onSubmit={saveDepartment}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
