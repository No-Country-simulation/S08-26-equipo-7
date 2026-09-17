import { Loader2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { getCategories } from "../../services/categoryApi";
import { createTicket as sendTicket } from "../../services/ticketApi";
import CategoryField from "./CategoryField";

const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 1000;

//trae las categorías activas desde la API
async function fetchCategories() {
  const categories = await getCategories();
  return categories;
}

//envia el formulario para crear el ticket
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

  try {
    const result = await sendTicket({
      title,
      description,
      category,
    });

    return { success: true, message: result.message };
  } catch (error) {
    return { error: error.message };
  }
}

export default function CreateForm({ onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [state, formAction, isPending] = useActionState(
    createTicketAction,
    null,
  );

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!state?.success) return;

    const resetTimer = setTimeout(() => {
      onSuccess?.();
      setSelectedCategory("");
      setTitle("");
      setDescription("");
    }, 0);

    return () => clearTimeout(resetTimer);
  }, [state?.success, onSuccess]);

  return (
    <form action={formAction} onReset={(event) => event.preventDefault()}>
      <div className="space-y-2">
        <CategoryField
          categories={categories}
          value={selectedCategory}
          onChange={setSelectedCategory}
          error={state?.errors?.category}
          disabled={isPending}
        />

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
