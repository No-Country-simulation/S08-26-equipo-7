import { Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useKnowledgeContext } from "@/features/knowledge/context/KnowledgeContext";

export default function TextBlock({ block, colKey }) {
  const { isEditing, handleDeleteBlock, handleUpdateBlockField } = useKnowledgeContext();

  return (
    <div className="bg-card border-border rounded-lg p-5 border shadow-sm group">
      {isEditing && (
        <div className="flex justify-end pb-4">
          <button
            type="button"
            onClick={() => handleDeleteBlock(colKey, block.id)}
            className="text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
            title="Eliminar bloque"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <Input
              type="text"
              value={block.title || ""}
              onChange={(e) => handleUpdateBlockField(colKey, block.id, 'title', e.target.value)}
              placeholder="Título del párrafo (Opcional)..."
              className="h-8 text-xs font-bold w-full"
            />
          ) : (
            block.title && <h3 className="font-bold text-sm sm:text-base text-foreground">{block.title}</h3>
          )}
        </div>

        {isEditing ? (
          <Textarea
            value={block.content || ""}
            onChange={(e) => handleUpdateBlockField(colKey, block.id, 'content', e.target.value)}
            className="w-full text-xs sm:text-sm resize-none bg-background leading-relaxed"
            rows={4}
            placeholder="Escribe el contenido del texto aquí..."
          />
        ) : (
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {block.content}
          </p>
        )}
      </div>
    </div>
  );
}