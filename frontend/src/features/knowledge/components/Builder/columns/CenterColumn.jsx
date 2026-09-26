import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import BlockCreatorModal from "@/features/knowledge/components/Builder/BlockCreatorModal";
import { renderBlockComponent } from "@/features/knowledge/components/Builder/BlockFactory";
import KnowledgeFeedback from "@/features/knowledge/components/Builder/blocks/KnowledgeFeedback";
import KnowledgeHeader from "@/features/knowledge/components/Builder/blocks/KnowledgeHeader";

export default function CenterColumn({ 
  columns, 
  isEditing, 
  editForm, 
  setEditForm, 
  categories, 
  activeWizardColumn, 
  setActiveWizardColumn, 
  onDeleteBlock, 
  onUpdateBlockField, 
  handleCreateBlockFromModal 
}) {
  const leftVisible = isEditing || (columns?.left && columns.left.length > 0);
  const rightVisible = isEditing || (columns?.right && columns.right.length > 0);
  const centerBlocks = columns?.center || [];

  const spanClass = leftVisible && rightVisible 
    ? 'lg:col-span-2' 
    : leftVisible || rightVisible 
      ? 'lg:col-span-3' 
      : 'lg:col-span-4';

  return (
    <div className={`${spanClass} space-y-4`}>
      <KnowledgeHeader 
        editForm={editForm} 
        setEditForm={setEditForm} 
        isEditing={isEditing} 
        categories={categories}
      />

      <div className="space-y-4">
        {centerBlocks.map((block) => 
          renderBlockComponent(block, "center", isEditing, onDeleteBlock, onUpdateBlockField)
        )}
      </div>

      {isEditing && (
        activeWizardColumn === 'center' ? (
          <BlockCreatorModal 
            columnKey="center" 
            onClose={() => setActiveWizardColumn(null)} 
            onCreate={handleCreateBlockFromModal} 
          />
        ) : (
          <Button
            variant="unstyled"
            onClick={() => setActiveWizardColumn('center')}
            className="w-full py-5 text-xs  border-2 border-dashed hover:border-primary/40 border-primary/20 text-primary rounded-2xl sm:text-sm font-bold transition-all cursor-pointer text-center"
          >
            <Plus /> Añadir bloque en Col. Central
          </Button>
        )
      )}

      <KnowledgeFeedback 
        megusta={editForm.megusta} 
        nomegusta={editForm.nomegusta} 
      />
    </div>
  );
}