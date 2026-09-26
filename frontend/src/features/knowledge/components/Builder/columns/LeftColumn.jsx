import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import BlockCreatorModal from "@/features/knowledge/components/Builder/BlockCreatorModal";
import { renderBlockComponent } from "@/features/knowledge/components/Builder/BlockFactory";
export default function LeftColumn({ 
  columns, 
  isEditing, 
  activeWizardColumn, 
  setActiveWizardColumn, 
  onDeleteBlock, 
  onUpdateBlockField, 
  handleCreateBlockFromModal 
}) {
  const leftBlocks = columns?.left || [];

  if (!isEditing && leftBlocks.length === 0) return null;

  return (
    <div className="lg:col-span-1 space-y-4">
      {/* Renderizado directo y seguro */}
      {leftBlocks.map((block) => 
        renderBlockComponent(block, "left", isEditing, onDeleteBlock, onUpdateBlockField)
      )}
      
      {isEditing && (
        activeWizardColumn === "left" ? (
          <BlockCreatorModal 
            columnKey="left" 
            onClose={() => setActiveWizardColumn(null)} 
            onCreate={handleCreateBlockFromModal} 
          />
        ) : (
          <Button
            variant="unstyled"
            onClick={() => setActiveWizardColumn("left")}
            className="w-full py-5 text-xs border-2 border-dashed hover:border-primary/40 border-primary/20 text-primary rounded-2xl sm:text-sm font-bold transition-all cursor-pointer text-center"
          >
            <Plus /> Añadir bloque en Col. Izquierda
          </Button>
        )
      )}
    </div>
  );
}