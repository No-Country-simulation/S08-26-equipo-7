import { toast } from "sonner";

export function useKnowledgeBlocks(editForm, setEditForm) {
  const handleDeleteBlock = (colKey, blockId) => {
    const currentColumns = editForm.layoutConfig?.columns || {
      left: [],
      center: [],
      right: [],
    };
    const updatedCol = (currentColumns[colKey] || []).filter(
      (b) => b.id !== blockId,
    );

    setEditForm({
      ...editForm,
      layoutConfig: {
        ...editForm.layoutConfig,
        columns: { ...currentColumns, [colKey]: updatedCol },
      },
    });

    toast("Bloque eliminado", {
      description: "El bloque se ha removido de la columna.",
      className: "bg-foreground! dark:bg-background! text-white!",
    });
  };

  const handleUpdateBlockField = (colKey, blockId, field, value) => {
    const currentColumns = editForm.layoutConfig?.columns || {
      left: [],
      center: [],
      right: [],
    };
    const updatedCol = (currentColumns[colKey] || []).map((b) =>
      b.id === blockId ? { ...b, [field]: value } : b,
    );

    setEditForm({
      ...editForm,
      layoutConfig: {
        ...editForm.layoutConfig,
        columns: { ...currentColumns, [colKey]: updatedCol },
      },
    });
  };

  const handleCreateBlockFromModal = (
    colKey,
    { type, title, initialContent },
  ) => {
    const newBlock = {
      id: `${colKey}-${Date.now()}`,
      type,
      title,
      content: ["warning", "code", "text"].includes(type)
        ? initialContent || "Escriba el contenido aquí..."
        : undefined,
      items:
        type === "steps" ? [initialContent || "Paso inicial 1"] : undefined,
    };

    const currentLayout = editForm.layoutConfig || {};
    const currentColumns = currentLayout.columns || {
      left: [],
      center: [],
      right: [],
    };
    const targetColumn = currentColumns[colKey] || [];

    setEditForm({
      ...editForm,
      layoutConfig: {
        ...currentLayout,
        columns: {
          ...currentColumns,
          [colKey]: [...targetColumn, newBlock],
        },
      },
    });

    toast.success("¡Bloque añadido con éxito!", {
      description: `Se agregó un nuevo bloque de tipo "${type}" en la columna ${colKey}.`,
      className: "bg-foreground! dark:bg-background! text-white!",
    });
  };

  return {
    handleDeleteBlock,
    handleUpdateBlockField,
    handleCreateBlockFromModal,
  };
}