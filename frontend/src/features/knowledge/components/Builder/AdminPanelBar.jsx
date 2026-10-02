import {
  ArrowLeft,
  Edit3,
  Loader2,
  Power,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useKnowledgeContext } from "@/features/knowledge/context/KnowledgeContext";

export default function AdminPanelBar() {
  const {
    isAdmin,
    isEditing,
    isSaving,
    isDeleting,
    editForm,
    handleToggleActive,
    handleStartEdit,
    setShowCancelDialog,
    handleSaveChanges,
    setShowDeleteDialog,
    isCreating,
  } = useKnowledgeContext();

  return (
    <div className="bg-card border-border flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 shadow-sm transition-all duration-200">
      <Link
        className="text-primary flex min-w-0 flex-1 items-center space-x-2 text-xs hover:underline sm:text-sm"
        to="/knowledge"
      >
        <ArrowLeft size={16} className="shrink-0" />
        <span className="truncate">Volver a la base de conocimiento</span>
      </Link>

      {isAdmin && (
        <div className="flex flex-wrap items-center gap-2">
          {!isEditing ? (
            <Button
              onClick={handleStartEdit}
              className="btn-gradient-primary h-9 w-auto cursor-pointer gap-2 rounded-lg px-3! text-xs"
            >
              <Edit3 size={14} />
              Modo Edición
            </Button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleToggleActive}
                disabled={isSaving}
                className={`h-9 cursor-pointer gap-1.5 px-3 text-xs ${
                  editForm.activo
                    ? "text-destructive border-destructive/40 hover:bg-destructive/10"
                    : "text-success border-success/40 hover:bg-success/10"
                }`}
              >
                <Power size={14} />
                {editForm.activo ? "Desactivar" : "Activar"}
              </Button>

              {!isCreating && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isDeleting || isSaving}
                  className="h-9 cursor-pointer gap-1.5 px-3 text-xs"
                >
                  {isDeleting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Eliminar
                </Button>
              )}

              <Button
                type="button"
                size="sm"
                className="bg-destructive hover:bg-destructive/80 h-9 rounded-md px-3 text-xs text-white"
                onClick={() => setShowCancelDialog(true)}
                disabled={isSaving}
              >
                <X size={14} /> Cancelar
              </Button>

              <Button
                type="button"
                size="sm"
                className="bg-success hover:bg-success/80 h-9 gap-2 rounded-md px-3 text-xs text-white"
                onClick={handleSaveChanges}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Guardando...
                  </>
                ) : (
                  <>
                    <Save size={14} /> Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
