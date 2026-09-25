import { ListOrdered, Plus,Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function StepsBlock({ block, colKey, isEditing, onDelete, onUpdate }) {
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
            <Trash2 size={14}  />
          </button>
        </div>
      )}

      <div>
        {/* Cabecera del bloque */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-primary flex items-center gap-2">
            <ListOrdered size={16} /> 
            {isEditing ? (
              <Input
                type="text"
                value={block.title}
                onChange={(e) => onUpdate(colKey, block.id, 'title', e.target.value)}
                className="h-8 text-xs font-bold w-auto"
              />
            ) : (
              block.title
            )}
          </h3>
        </div>

        {/* Lista de elementos / pasos */}
        <ol className="list-inside list-decimal space-y-2">
          {block.items?.map((step, idx) => (
            isEditing ? (
              <div key={idx} className="flex items-center gap-2 my-1">
                <Input
                  type="text"
                  value={step}
                  onChange={(e) => {
                    const newItems = [...block.items];
                    newItems[idx] = e.target.value;
                    onUpdate(colKey, block.id, 'items', newItems);
                  }}
                  className="w-full text-xs h-8"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newItems = [...block.items];
                    newItems.splice(idx, 1);
                    onUpdate(colKey, block.id, 'items', newItems);
                  }}
                  className="text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
                  title="Eliminar paso"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <li key={idx} className="text-muted-foreground text-sm leading-relaxed">{step}</li>
            )
          ))}
        </ol>

        {/* Botón para añadir un nuevo paso en edición */}
        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            className="mt-3 text-xs h-8"
            onClick={() => {
              const newItems = [...(block.items || []), "Nuevo paso descriptivo"];
              onUpdate(colKey, block.id, 'items', newItems);
            }}
          >
            <Plus /> Añadir paso
          </Button>
        )}
      </div>
    </div>
  );
}