import { useCallback, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { createKnowledge, updateKnowledge } from "@/features/knowledge/service/knowledgeApi";

const cloneForm = (form) => JSON.parse(JSON.stringify(form ?? {}));

export function useKnowledgeForm(
  id,
  editForm,
  setEditForm,
  savedForm,
  setSavedForm,
) {
  const navigate = useNavigate();
  const location = useLocation();

  const isCreating = location.pathname.includes("/knowledge/new") || id === "new";

  const [isEditing, setIsEditing] = useState(isCreating);
  const [isSaving, setIsSaving] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [activeWizardColumn, setActiveWizardColumn] = useState(null);

  const skipNextNavigationBlockRef = useRef(false);
  const isDirty =
    isEditing &&
    JSON.stringify(editForm) !== JSON.stringify(savedForm);

  const shouldBlockNavigation = useCallback(() => {
    if (skipNextNavigationBlockRef.current) {
      skipNextNavigationBlockRef.current = false;
      return false;
    }

    return isDirty;
  }, [isDirty]);

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleConfirmCancel = () => {
    if (isCreating) {
      skipNextNavigationBlockRef.current = true;
      navigate("/knowledge");
      return;
    }

    setEditForm(cloneForm(savedForm));
    setIsEditing(false);
    setActiveWizardColumn(null);
    setShowCancelDialog(false);

    toast.error("Edición cancelada", {
      description: "Se han descartado los cambios no guardados.",
      className: "bg-foreground! dark:bg-background! text-white!",
    });
  };

  const handleSaveChanges = async () => {
    if (
      !editForm.titulo?.trim() ||
      !editForm.descripcion?.trim() ||
      !editForm.categoria?.trim() ||
      !editForm.tiempoLecturaMin
    ) {
      toast.error("Campos incompletos", {
        description: "Título, descripción, categoría y tiempo de lectura son obligatorios.",
        className: "bg-foreground! dark:bg-background! text-white!",
      });
      return false;
    }

    try {
      setIsSaving(true);

      const payload = {
        titulo: editForm.titulo,
        descripcion: editForm.descripcion,
        contenido: editForm.contenido,
        categoria: editForm.categoria,
        tiempoLecturaMin: Number(editForm.tiempoLecturaMin),
        activo: editForm.activo ?? true,
        layoutConfig: editForm.layoutConfig,
      };

      if (isCreating) {
        await createKnowledge(payload);
        setSavedForm(cloneForm(editForm));
        skipNextNavigationBlockRef.current = true;
        toast.success("¡Artículo creado con éxito!", {
          description: "El artículo se ha publicado correctamente.",
          className: "bg-foreground! dark:bg-background! text-white!",
        });
        navigate("/knowledge", { replace: true });
      } else {
        await updateKnowledge(id, payload);
        setSavedForm(cloneForm(editForm));
        toast.success("¡Cambios guardados!", {
          description: "El artículo se ha actualizado correctamente en el servidor.",
          className: "bg-foreground! dark:bg-background! text-white!",
        });
        setIsEditing(false);
      }
      return true;
    } catch (error) {
      console.error("Error al guardar artículo:", error);
      toast.error("Error de servidor", {
        description: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
        className: "bg-foreground! dark:bg-background! text-white!",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isEditing,
    isDirty,
    isSaving,
    showCancelDialog,
    setShowCancelDialog,
    activeWizardColumn,
    setActiveWizardColumn,
    handleStartEdit,
    handleConfirmCancel,
    handleSaveChanges,
    shouldBlockNavigation,
    isCreating,
  };
}
