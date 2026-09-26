import { AlertTriangle, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function WarningBlock({ block, colKey, isEditing, onDelete, onUpdate }) {
  return (
    <div className="bg-card border-border rounded-lg p-5 border shadow-sm group">
      {/* Botón de eliminar bloque en modo edición */}
      {isEditing && (
        <div className="flex justify-end pb-4 ">
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

      <div className="bg-warning/30 border border-warning p-4 rounded-lg">
        <h4 className="font-bold text-xs text-warning mb-1 flex items-center gap-2">
          <AlertTriangle size={18} /> 
          {isEditing ? (
            <Input
              type="text"
              value={block.title}
              onChange={(e) => onUpdate(colKey, block.id, 'title', e.target.value)}
              className="h-8 text-xs font-bold w-full bg-background"
            />
          ) : (
            block.title
          )}
        </h4>

        {isEditing ? (
          <Textarea
            value={block.content}
            onChange={(e) => onUpdate(colKey, block.id, 'content', e.target.value)}
            className="w-full text-xs resize-none mt-2 bg-background"
            rows={2}
          />
        ) : (
          <p className="text-xs text-muted-foreground mt-1">{block.content}</p>
        )}
      </div>
    </div>
  );
}