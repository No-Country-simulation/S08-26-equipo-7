import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

// Componentes de Shadcn UI
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatTicketDate } from "@/lib/utils";

export default function KnowledgeHeader({ editForm, setEditForm, isEditing, categories = [] }) {
  return (
    <article className="bg-card border-border rounded-lg border p-4 sm:p-6 shadow-md space-y-4 overflow-hidden">
      {/* Contenedor principal con flex-wrap para permitir saltos de línea ordenados */}
      <div className="flex items-start md:items-center justify-between flex-wrap gap-4">
        
        {/* Link de volver (min-w-0 evita que el texto bloquee el espacio y flex-1 permite que se ajuste) */}
        <Link className="text-primary flex space-x-2 text-xs sm:text-sm items-center hover:underline flex-1 shrink min-w-5" to="/knowledge">
          <ArrowLeft size={16} className="shrink-0" />
          <span className="truncate">Volver a la base de conocimiento</span>
        </Link>

        {/* Contenedor de metadatos con wrap */}
        <div className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground/70">
          {isEditing ? (
            <div className="flex items-center flex-wrap gap-2">
              {/* Select de Shadcn para las categorías */}
              <Select 
                value={editForm.categoria} 
                onValueChange={(value) => setEditForm({ ...editForm, categoria: value })}
              >
                <SelectTrigger className="py-2 text-xs border border-border w-35 sm:w-40">
                  <SelectValue placeholder="Seleccione área" />
                </SelectTrigger>
                <SelectContent className="p-2">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.code} className="text-xs">
                      {cat.name} ({cat.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <span>•</span>
              
              {/* Input de Shadcn para el tiempo de lectura */}
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min="1"
                  value={editForm.tiempoLecturaMin}
                  onChange={(e) => {
                    const val = e.target.value;
                    const newNumber = val === "" ? "" : Math.max(1, Number(val));
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
            <div className="flex items-center flex-wrap gap-2">
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

          <span className="flex items-center gap-1 shrink-0">
            <Calendar size={14} /> {formatTicketDate(editForm.actualizado_en || editForm.actualizadoEn)}
          </span>
        </div>
      </div>

      {/* Título y Descripción */}
      {isEditing ? (
        <div className="space-y-3">
          <Input
            type="text"
            value={editForm.titulo}
            onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
            className="text-lg sm:text-2xl font-bold h-12"
            placeholder="Título principal del artículo..."
          />
          <Textarea
            value={editForm.descripcion}
            onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })}
            className="text-sm resize-none"
            rows={2}
            placeholder="Descripción corta..."
          />
        </div>
      ) : (
        <div>
          <h1 className="text-xl sm:text-3xl font-bold break-all sm:break-normal sm:whitespace-normal">{editForm.titulo}</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">{editForm.descripcion}</p>
        </div>
      )}
    </article>
  );
}