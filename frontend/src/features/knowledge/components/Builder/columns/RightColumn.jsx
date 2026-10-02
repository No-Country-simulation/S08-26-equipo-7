import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import BlockCreatorModal from "@/features/knowledge/components/Builder/BlockCreatorModal";
import { renderBlockComponent } from "@/features/knowledge/components/Builder/BlockFactory";
import { useKnowledgeContext } from "@/features/knowledge/context/KnowledgeContext";

export default function RightColumn() {
  const { columns, isEditing, activeWizardColumn, setActiveWizardColumn } =
    useKnowledgeContext();
  const rightBlocks = columns?.right || [];

  if (!isEditing && rightBlocks.length === 0) return null;

  return (
    <div className="min-w-0 space-y-4 lg:col-span-1">
      {rightBlocks.map((block) => renderBlockComponent(block, "right"))}

      {isEditing &&
        (activeWizardColumn === "right" ? (
          <BlockCreatorModal columnKey="right" />
        ) : (
          <Button
            variant="unstyled"
            onClick={() => setActiveWizardColumn("right")}
            className="hover:border-primary/40 border-primary/20 text-primary mb-4 w-full cursor-pointer rounded-2xl border-2 border-dashed py-5 text-center text-xs font-bold transition-all md:text-sm"
          >
            <Plus /> Añadir bloque
          </Button>
        ))}
    </div>
  );
}