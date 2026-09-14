import { CheckCircle2, Info, Loader2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { categories } from "../categoryApi";
import { createTicket as sendTicket } from "../ticketApi";

const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 1000;
const activeCategories = categories.filter((category) => category.active);

async function createTicketAction(_, formData) {
  const title = formData.get("title");
  const description = formData.get("description");
  const category = formData.get("category");

  if (!category) {
    return { errors: { category: "Selecciona un área responsable" } };
  }

  if (!title?.trim()) {
    return { errors: { title: "El título es obligatorio" } };
  }

  if (title.length > MAX_TITLE_LENGTH) {
    return {
      errors: {
        title: `El título no puede superar los ${MAX_TITLE_LENGTH} caracteres`,
      },
    };
  }

  if (!description?.trim()) {
    return { errors: { description: "La descripción es obligatoria" } };
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return {
      errors: {
        description: `La descripción no puede superar los ${MAX_DESCRIPTION_LENGTH} caracteres`,
      },
    };
  }

  const categoryData = categories.find((item) => item.code === category);

  try {
    const result = await sendTicket({
      description,
      category,
      priority: categoryData?.priority,
      requiresApproval: categoryData?.requiresApproval,
    });

    return { success: true, message: result.message };
  } catch (error) {
    return { error: error.message };
  }
}

export default function CreateTicketForm() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [state, formAction, isPending] = useActionState(
    createTicketAction,
    null,
  );

  useEffect(() => {
    if (!state?.success) return;

    const resetTimer = setTimeout(() => {
      setSelectedCategory("");
      setTitle("");
      setDescription("");
    }, 0);

    return () => clearTimeout(resetTimer);
  }, [state?.success]);

  const selectedCategoryData = categories.find(
    (category) => category.code === selectedCategory,
  );

  return (
    <form action={formAction} onReset={(event) => event.preventDefault()}>
      {state?.success && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 flex items-center gap-2 rounded-md border border-success/30 bg-success/5 px-3 py-2 text-sm font-medium text-success"
        >
          <CheckCircle2 className="size-4 shrink-0" />
          Solicitud creada correctamente.
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="category-trigger" className="font-semibold">
          Área responsable <span aria-hidden="true">*</span>
        </Label>
        {activeCategories.length > 0 ? (
          <>
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                if (value) setSelectedCategory(value);
              }}
              disabled={isPending}
            >
              <SelectTrigger
                id="category-trigger"
                className="w-full border border-border"
                aria-invalid={Boolean(state?.errors?.category)}
                aria-describedby={
                  state?.errors?.category ? "category-error" : undefined
                }
              >
                <SelectValue placeholder="Selecciona un área" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Áreas disponibles</SelectLabel>
                  {activeCategories.map((category) => (
                    <SelectItem key={category.id} value={category.code}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <input type="hidden" name="category" value={selectedCategory} />
            <FieldError
              id="category-error"
              errors={state?.errors?.category}
            />
          </>
        ) : (
          <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            No hay áreas disponibles en este momento.
          </p>
        )}
        {selectedCategoryData && (
          <p className="ml-1 text-sm text-muted-foreground">
            Área encargada de: {selectedCategoryData.description}
          </p>
        )}
        {selectedCategoryData?.requiresApproval && (
          <p className="flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
            <Info className="size-4 shrink-0" />
  Esta solicitud requiere aprobación antes de ser atendida.
          </p>
        )}

        <Label htmlFor="title" className="font-semibold">
          Título de la solicitud <span aria-hidden="true">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="Ej. Falla de conexión VPN o compra de monitor"
          value={title}
          maxLength={MAX_TITLE_LENGTH}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isPending}
          aria-invalid={Boolean(state?.errors?.title)}
          aria-describedby={state?.errors?.title ? "title-error" : undefined}
        />
        <div className="flex items-start justify-between gap-2">
          <FieldError id="title-error" errors={state?.errors?.title} />
          <span className="ml-auto text-xs text-muted-foreground">
            {title.length}/{MAX_TITLE_LENGTH}
          </span>
        </div>

        <Label htmlFor="description" className="font-semibold">
          Descripción de la solicitud <span aria-hidden="true">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe el problema, contexto y resultado esperado"
          className="min-h-32 resize-y border border-border max-w-136"
          value={description}
          maxLength={MAX_DESCRIPTION_LENGTH}
          onChange={(event) => setDescription(event.target.value)}
          disabled={isPending}
          aria-invalid={Boolean(state?.errors?.description)}
          aria-describedby={
            state?.errors?.description ? "description-error" : undefined
          }
        />
        <div className="flex items-start justify-between gap-2">
          <FieldError
            id="description-error"
            errors={state?.errors?.description}
          />
          <span className="ml-auto text-xs text-muted-foreground">
            {description.length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
        {state?.error && (
          <p
            role="alert"
            aria-live="polite"
            className="my-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-center text-sm font-medium text-destructive"
          >
            {state.error}
          </p>
        )}
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="outline"
            className="h-11 cursor-pointer rounded-xl px-6 py-2"
            disabled={isPending}
          >
            Cancelar
          </Button>
        </DialogClose>
        <Button
          type="submit"
          className="btn-gradient-primary cursor-pointer"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar solicitud"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
