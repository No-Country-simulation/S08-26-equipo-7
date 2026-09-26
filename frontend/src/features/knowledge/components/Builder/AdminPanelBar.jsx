import { Edit3, Loader2, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AdminPanelBar({ 
  isAdmin, 
  isEditing, 
  isSaving, // <--- 1. Recibimos la prop aquí
  onStartEdit, 
  onCancelEdit, 
  onSave 
}) {
  if (!isAdmin) return null;

  return (
    <div className="bg-card border-border flex items-center justify-end rounded-lg border p-3 shadow-sm">
      {!isEditing ? (
        <Button 
          onClick={onStartEdit} 
          className="btn-gradient-primary w-auto cursor-pointer gap-2 rounded-lg px-3!"
        >
          <Edit3 size={14} />Modo Edición
        </Button>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            className="rounded-md bg-destructive py-4 text-white hover:bg-destructive/80 sm:rounded-lg sm:py-5" 
            onClick={onCancelEdit}
            disabled={isSaving} // <--- 2. Deshabilitamos cancelar mientras guarda
          >
            <X size={18} /> Cancelar
          </Button>

          <Button 
            size="sm" 
            className="bg-success hover:bg-success/80 gap-2 rounded-md py-4 text-white sm:rounded-lg sm:py-5" 
            onClick={onSave}
            disabled={isSaving} // <--- 3. Deshabilitamos guardar para evitar doble envío
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Guardando...
              </>
            ) : (
              <>
                <Save size={18} /> Guardar Cambios
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}