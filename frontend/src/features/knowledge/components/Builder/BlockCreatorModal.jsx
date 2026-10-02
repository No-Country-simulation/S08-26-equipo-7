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
import { useKnowledgeContext } from "@/features/knowledge/context/KnowledgeContext";

export default function BlockCreatorModal({ columnKey }) {
  const { setActiveWizardColumn, handleCreateBlockFromModal } = useKnowledgeContext();

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

    handleCreateBlockFromModal(columnKey, {
      type: blockType,
      title: title,
      initialContent: detail
    });
  };

  return (
    <div className="bg-card border border-border relative w-full min-w-0 space-y-4 rounded-lg p-4 shadow-xl sm:p-6">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h4 className="font-bold text-sm text-primary flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          Crear Bloque en Columna {columnKey.toUpperCase()}
        </h4>
        <button
          type="button"
          onClick={() => setActiveWizardColumn(null)}
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

        <div className="flex flex-col items-stretch justify-end gap-2 pt-2">
          <Button
            type="button"
            size="sm"
            onClick={() => setActiveWizardColumn(null)}
            className="w-full whitespace-normal rounded-lg bg-destructive py-4 text-xs font-semibold text-white hover:bg-destructive/90"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="sm"
            className="w-full whitespace-normal rounded-lg bg-success py-4 text-xs font-semibold text-white hover:bg-success/90"
          >
            Crear y Añadir Bloque
          </Button>
        </div>
      </form>
    </div>
  );
}