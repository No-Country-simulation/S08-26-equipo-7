import { ListOrdered, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKnowledgeContext } from "@/features/knowledge/context/KnowledgeContext";

export default function StepsBlock({ block, colKey }) {
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
            <Trash2 size={14} />
          </button>
        </div>
      )}

      <div>
        <div className="mb-3 flex w-full items-center justify-between">
          <h3 className="text-primary flex items-center gap-2 text-sm font-bold">
            <ListOrdered size={16} />
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
                className="h-8 w-full text-xs font-bold"
              />
            ) : (
              block.title
            )}
          </h3>
        </div>

        <ol className="list-inside list-decimal space-y-2">
          {block.items?.map((step, idx) =>
            isEditing ? (
              <div key={idx} className="my-1 flex items-center gap-2">
                <Input
                  type="text"
                  value={step}
                  onChange={(e) => {
                    const newItems = [...block.items];
                    newItems[idx] = e.target.value;
                    handleUpdateBlockField(colKey, block.id, "items", newItems);
                  }}
                  className="h-8 w-full text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newItems = [...block.items];
                    newItems.splice(idx, 1);
                    handleUpdateBlockField(colKey, block.id, "items", newItems);
                  }}
                  className="text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
                  title="Eliminar paso"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <li
                key={idx}
                className="text-muted-foreground text-sm leading-relaxed"
              >
                {step}
              </li>
            ),
          )}
        </ol>

        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            className="mt-3 h-8 text-xs"
            onClick={() => {
              const newItems = [
                ...(block.items || []),
                "Nuevo paso descriptivo",
              ];
              handleUpdateBlockField(colKey, block.id, "items", newItems);
            }}
          >
            <Plus /> Añadir paso
          </Button>
        )}
      </div>
    </div>
  );
}
