import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import BlockCreatorModal from "@/features/knowledge/components/Builder/BlockCreatorModal";
import { renderBlockComponent } from "@/features/knowledge/components/Builder/BlockFactory";
import { useKnowledgeContext } from "@/features/knowledge/context/KnowledgeContext";

export default function LeftColumn() {
  const { columns, isEditing, activeWizardColumn, setActiveWizardColumn } =
    useKnowledgeContext();
  const leftBlocks = columns?.left || [];

  if (!isEditing && leftBlocks.length === 0) return null;

  return (
    <div className="space-y-4 lg:col-span-1">
      {leftBlocks.map((block) => renderBlockComponent(block, "left"))}

      {isEditing &&
        (activeWizardColumn === "left" ? (
          <BlockCreatorModal columnKey="left" />
        ) : (
          <Button
            variant="unstyled"
            onClick={() => setActiveWizardColumn("left")}
            className="hover:border-primary/40 border-primary/20 text-primary w-full cursor-pointer rounded-2xl border-2 border-dashed py-5 text-center text-xs font-bold transition-all md:text-sm"
          >
            <Plus /> Añadir bloque
          </Button>
        ))}
    </div>
  );
}