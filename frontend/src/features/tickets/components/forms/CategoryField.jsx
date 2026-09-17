import { Info } from "lucide-react";

import { FieldError } from "@/components/ui/field";
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

export default function CategoryField({
  categories,
  value,
  onChange,
  error,
  disabled,
}) {
  const selectedCategory = categories.find((category) => category.code === value);

  return (
    <>
      <Label htmlFor="category-trigger" className="font-semibold">
        Área responsable <span aria-hidden="true">*</span>
      </Label>
      {categories.length > 0 ? (
        <>
          <Select
            value={value}
            onValueChange={(nextValue) => {
              if (nextValue) onChange(nextValue);
            }}
            disabled={disabled}
          >
            <SelectTrigger
              id="category-trigger"
              className="w-full border border-border"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "category-error" : undefined}
            >
              <SelectValue placeholder="Selecciona un área" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Áreas disponibles</SelectLabel>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.code}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <input type="hidden" name="category" value={value} />
          <FieldError id="category-error" errors={error} />
        </>
      ) : (
        <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          No hay áreas disponibles en este momento.
        </p>
      )}
      {selectedCategory && (
        <p className="ml-1 text-sm text-muted-foreground">
          Área encargada de: {selectedCategory.description}
        </p>
      )}
      {selectedCategory?.requiresApproval && (
        <p className="flex items-center gap-2 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning">
          <Info className="size-4 shrink-0" />
          Esta solicitud requiere aprobación antes de ser atendida.
        </p>
      )}
    </>
  );
}
