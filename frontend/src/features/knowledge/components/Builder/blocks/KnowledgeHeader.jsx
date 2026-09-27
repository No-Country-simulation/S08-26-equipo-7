import { Calendar, Clock } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useKnowledgeContext } from "@/features/knowledge/context/KnowledgeContext";
import { formatTicketDate } from "@/lib/utils";

export default function KnowledgeHeader() {
  const {
    editForm,
    setEditForm,
    isEditing,
    categories = [],
  } = useKnowledgeContext();

  return (
    <article className="bg-card border-border space-y-4 overflow-hidden rounded-lg border p-4 shadow-md sm:p-6">
      <div className="flex flex-wrap items-center justify-end gap-4">
        <div className="text-muted-foreground/70 flex flex-wrap items-center gap-2 text-xs">
          {isEditing ? (
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={editForm.categoria}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, categoria: value })
                }
              >
                <SelectTrigger className="border-border w-35 border py-2 text-xs sm:w-40">
                  <SelectValue placeholder="Seleccione área" />
                </SelectTrigger>
                <SelectContent className="p-2">
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.code}
                      className="text-xs"
                    >
                      {cat.name} ({cat.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min="1"
                  value={editForm.tiempoLecturaMin}
                  onChange={(e) => {
                    const val = e.target.value;
                    const newNumber =
                      val === "" ? "" : Math.max(1, Number(val));
                    setEditForm({ ...editForm, tiempoLecturaMin: newNumber });
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "" || Number(e.target.value) < 1) {
                      setEditForm({ ...editForm, tiempoLecturaMin: 1 });
                    }
                  }}
                  className="h-8 w-16 text-xs"
                />
                <span className="text-xs">min</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-primary bg-primary/10 rounded-md px-2 py-1 font-semibold">
                {editForm.categoria}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> {editForm.tiempoLecturaMin} min lectura
              </span>
            </div>
          )}

          <span>•</span>

          <span className="flex shrink-0 items-center gap-1">
            <Calendar size={14} />{" "}
            {formatTicketDate(
              editForm.actualizado_en || editForm.actualizadoEn,
            )}
          </span>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <Input
            type="text"
            value={editForm.titulo}
            onChange={(e) =>
              setEditForm({ ...editForm, titulo: e.target.value })
            }
            className="text-md h-12 font-bold sm:text-xl lg:text-2xl"
            placeholder="Título principal del artículo..."
          />
          <Textarea
            value={editForm.descripcion}
            onChange={(e) =>
              setEditForm({ ...editForm, descripcion: e.target.value })
            }
            className="resize-none text-sm"
            rows={2}
            placeholder="Descripción corta..."
          />
        </div>
      ) : (
        <div>
          <h1 className="text-xl font-bold break-all sm:text-3xl sm:break-normal sm:whitespace-normal">
            {editForm.titulo}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {editForm.descripcion}
          </p>
        </div>
      )}
    </article>
  );
}
