import { Code, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useKnowledgeContext } from "@/features/knowledge/context/KnowledgeContext";

export default function CodeBlock({ block, colKey }) {
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

      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-zinc-100">
        <div className="mb-2 flex items-center gap-2 border-b border-zinc-800 pb-2 text-xs text-zinc-400">
          <Code size={16} />
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
              placeholder="Lenguaje o título..."
              className="h-7 w-full border-zinc-700 bg-zinc-900 font-mono text-xs text-zinc-100"
            />
          ) : (
            <span>{block.title || "Snippet de código"}</span>
          )}
        </div>

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
            className="w-full resize-none border-zinc-700 bg-zinc-900 font-mono text-xs text-zinc-100"
            rows={4}
          />
        ) : (
          <pre className="overflow-x-auto rounded bg-zinc-900/50 p-2 text-xs text-zinc-200">
            <code>{block.content}</code>
          </pre>
        )}
      </div>
    </div>
  );
}