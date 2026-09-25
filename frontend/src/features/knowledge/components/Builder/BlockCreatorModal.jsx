import { Sparkles, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function BlockCreatorModal({ columnKey, onClose, onCreate }) {
  const [blockType, setBlockType] = useState("steps");
  const [title, setTitle] = useState("Nuevo Menú");
  const [detail, setDetail] = useState("");

  const handleSelectType = (selected) => {
    setBlockType(selected);
    
    switch (selected) {
      case "steps": setTitle("Lista de Pasos / Guía"); break;
      case "warning": setTitle("Alerta o Advertencia"); break;
      case "code": setTitle("Bloque de Código / Comando"); break;
      case "text": setTitle("Bloque de Texto"); break;
      default: setTitle("Nuevo Bloque");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate(columnKey, {
      type: blockType,
      title: title,
      initialContent: detail
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-xl space-y-4 relative">
      
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h4 className="font-bold text-sm text-primary flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          Crear Bloque en Columna {columnKey.toUpperCase()}
        </h4>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        
        <div>
          <label htmlFor="select-components" className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
            Tipo de Componente:
          </label>
          
          {/* Componente Select oficial de Shadcn UI */}
          <Select value={blockType} onValueChange={handleSelectType}>
            <SelectTrigger id="select-components" className="w-full text-xs h-9 border border-border">
              <SelectValue placeholder="Seleccione tipo" />
            </SelectTrigger>
            <SelectContent className="p-2">
              <SelectItem value="steps" className="text-xs">Lista de Pasos / Guía</SelectItem>
              <SelectItem value="warning" className="text-xs">Alerta o Advertencia</SelectItem>
              <SelectItem value="code" className="text-xs">Bloque de Código / Comando</SelectItem>
              <SelectItem value="text" className="text-xs">Bloque de Texto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="input-title-components" className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
            Título del Bloque:
          </label>
          <Input
            id="input-title-components"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xs h-9"
            placeholder="Ej. Enlaces Rápidos..."
          />
        </div>

        <div>
          <label htmlFor="input-detail-components" className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
            Contenido / Elemento Inicial:
          </label>
          <Input
            id="input-detail-components"
            type="text"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="text-xs h-9"
            placeholder="Ej. Primer paso o texto inicial..."
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            size="sm"
            onClick={onClose}
            className="rounded-lg text-xs font-semibold bg-destructive text-white py-4 hover:bg-destructive/90"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="sm"
            className="rounded-lg text-xs font-semibold bg-success text-white py-4 hover:bg-success/90"
          >
            Crear y Añadir Bloque
          </Button>
        </div>

      </form>
    </div>
  );
}