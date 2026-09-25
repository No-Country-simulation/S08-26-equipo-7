import { Edit3, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AdminPanelBar({ isAdmin, isEditing, onStartEdit, onCancelEdit, onSave }) {
  if (!isAdmin) return null;

  return (
    <div className="bg-card border-border p-3 rounded-lg flex items-center justify-end shadow-sm border">
      {!isEditing ? (
        <Button onClick={onStartEdit} className="gap-2 btn-gradient-primary w-auto px-3! cursor-pointer rounded-lg">
          <Edit3 size={14} />Modo Edición
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button size="sm" className="gap-2 py-5 rounded-lg bg-destructive text-white hover:bg-destructive/80" onClick={onCancelEdit}>
            <X size={18} /> Cancelar
          </Button>
          <Button size="sm" className="bg-success hover:bg-success/80 text-white gap-2 py-5 rounded-lg" onClick={onSave}>
            <Save size={18} /> Guardar Cambios (Mock)
          </Button>
        </div>
      )}
    </div>
  );
}