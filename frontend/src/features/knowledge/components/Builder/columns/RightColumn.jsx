import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import BlockCreatorModal from "@/features/knowledge/components/Builder/BlockCreatorModal";
import { renderBlockComponent } from "@/features/knowledge/components/Builder/BlockFactory";

export default function RightColumn({ 
  columns, 
  isEditing, 
  activeWizardColumn, 
  setActiveWizardColumn, 
  onDeleteBlock, 
  onUpdateBlockField, 
  handleCreateBlockFromModal 
}) {
  const rightBlocks = columns?.right || [];

  if (!isEditing && rightBlocks.length === 0) return null;

  return (
    <div className="lg:col-span-1 space-y-4">
      {rightBlocks.map((block) => 
        renderBlockComponent(block, "right", isEditing, onDeleteBlock, onUpdateBlockField)
      )}
      
      {isEditing && (
        activeWizardColumn === "right" ? (
          <BlockCreatorModal 
            columnKey="right" 
            onClose={() => setActiveWizardColumn(null)} 
            onCreate={handleCreateBlockFromModal} 
          />
        ) : (
          <Button
            variant="unstyled"
            onClick={() => setActiveWizardColumn("right")}
            className="w-full py-5 border-2 border-dashed hover:border-primary/40 border-primary/20 text-primary rounded-2xl text-sm font-bold transition-all cursor-pointer text-center"
          >
            <Plus /> Añadir bloque en Col. Derecha
          </Button>
        )
      )}
    </div>
  );
}