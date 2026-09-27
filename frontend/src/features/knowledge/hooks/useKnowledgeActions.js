import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { deleteKnowledge, updateKnowledge } from "@/features/knowledge/service/knowledgeApi";

export function useKnowledgeActions(id, editForm, setEditForm) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Alterna el estado activo/inactivo en el formulario
  const handleToggleActive = async () => {
    const newStatus = !editForm.activo;
    
    // Actualizamos el estado local del formulario para que se envíe al guardar
    setEditForm((prev) => ({ ...prev, activo: newStatus }));

    try {
      // Opcional: Persistimos de inmediato el cambio de visibilidad en la API
      await updateKnowledge(id, { ...editForm, activo: newStatus });
      toast.success(newStatus ? "Artículo activado" : "Artículo desactivado", {
        className: "bg-foreground! dark:bg-background! text-white!",
      });
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error("No se pudo actualizar el estado");
      // Revertir en caso de error
      setEditForm((prev) => ({ ...prev, activo: !newStatus }));
    }
  };

  // Ejecuta la eliminación en el servidor
  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteKnowledge(id);

      toast.success("Artículo eliminado", {
        description: "El registro ha sido borrado permanentemente.",
        className: "bg-foreground! dark:bg-background! text-white!",
      });

      navigate("/knowledge");
    } catch (error) {
      console.error("Error al eliminar artículo:", error);
      toast.error("Error de servidor", {
        description: "No se pudo eliminar el artículo.",
        className: "bg-foreground! dark:bg-background! text-white!",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return {
    isDeleting,
    showDeleteDialog,
    setShowDeleteDialog,
    handleToggleActive,
    handleConfirmDelete,
  };
}