import { AlertTriangle, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useKnowledgeContext } from "@/features/knowledge/context/KnowledgeContext";

export default function WarningBlock({ block, colKey }) {
  const { isEditing, handleDeleteBlock, handleUpdateBlockField } =
    useKnowledgeContext();

  return (
    <div className="bg-card border-border group rounded-lg border p-5 shadow-sm">
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

      <div className="bg-warning/35 border-warning rounded-lg border p-4">
        <h4 className="text-warning mb-1 flex items-center gap-2 text-xs font-bold">
          <AlertTriangle size={18} />
          {isEditing ? (
            <Input
              type="text"
              value={block.title}
              onChange={(e) =>
                handleUpdateBlockField(
                  colKey,
                  block.id,
                  "title",
                  e.target.value,
                )
              }
              className="bg-background h-8 w-full text-xs font-bold"
            />
          ) : (
            block.title
          )}
        </h4>

        {isEditing ? (
          <Textarea
            value={block.content}
            onChange={(e) =>
              handleUpdateBlockField(
                colKey,
                block.id,
                "content",
                e.target.value,
              )
            }
            className="bg-background mt-2 w-full resize-none text-xs"
            rows={2}
          />
        ) : (
          <p className="text-muted-foreground mt-1 text-xs">{block.content}</p>
        )}
      </div>
    </div>
  );
}