import { Code, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CodeBlock({ block, colKey, isEditing, onDelete, onUpdate }) {
  return (
    <div className="bg-card border-border rounded-lg p-5 border shadow-sm group">
      {/* Botón de eliminar bloque en modo edición */}
      {isEditing && (
        <div className="flex justify-end pb-4">
          <button
            type="button"
            onClick={() => onDelete(colKey, block.id)}
            className="text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
            title="Eliminar bloque"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}

      {/* Contenedor estilo terminal / código */}
      <div className="bg-zinc-950 text-zinc-100 border border-zinc-800 p-4 rounded-lg font-mono">
        {/* Cabecera del bloque de código (Título / Lenguaje) */}
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-800 text-xs text-zinc-400">
          <Code size={16} /> 
          {isEditing ? (
            <Input
              type="text"
              value={block.title}
              onChange={(e) => onUpdate(colKey, block.id, 'title', e.target.value)}
              placeholder="Lenguaje o título (ej. JavaScript)"
              className="h-7 text-xs font-mono w-full bg-zinc-900 border-zinc-700 text-zinc-100"
            />
          ) : (
            <span>{block.title || "Snippet de código"}</span>
          )}
        </div>

        {/* Editor de código (modo edición) vs Vista previa (modo lectura) */}
        {isEditing ? (
          <Textarea
            value={block.content}
            onChange={(e) => onUpdate(colKey, block.id, 'content', e.target.value)}
            className="w-full text-xs font-mono resize-none bg-zinc-900 border-zinc-700 text-zinc-100 focus-visible:ring-zinc-600"
            rows={4}
            placeholder="// Escribe o pega tu código aquí..."
          />
        ) : (
          <pre className="text-xs overflow-x-auto p-2 bg-zinc-900/50 rounded text-zinc-200">
            <code>{block.content}</code>
          </pre>
        )}
      </div>
    </div>
  );
}