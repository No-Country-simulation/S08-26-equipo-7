import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import BlockCreatorModal from "@/features/knowledge/components/Builder/BlockCreatorModal";
import { renderBlockComponent } from "@/features/knowledge/components/Builder/BlockFactory";
import KnowledgeFeedback from "@/features/knowledge/components/Builder/blocks/KnowledgeFeedback";
import KnowledgeHeader from "@/features/knowledge/components/Builder/blocks/KnowledgeHeader";
import { useKnowledgeContext } from "@/features/knowledge/context/KnowledgeContext";

export default function CenterColumn() {
  const {
    columns,
    isEditing,
    activeWizardColumn,
    setActiveWizardColumn,
    userVote,
  } = useKnowledgeContext();

  const leftVisible = isEditing || (columns?.left && columns.left.length > 0);
  const rightVisible =
    isEditing || (columns?.right && columns.right.length > 0);
  const centerBlocks = columns?.center || [];

  const spanClass =
    leftVisible && rightVisible
      ? "lg:col-span-2"
      : leftVisible || rightVisible
        ? "lg:col-span-3"
        : "lg:col-span-4";

  return (
    <div className={`${spanClass} min-w-0 space-y-4`}>
      <KnowledgeHeader />

      <div className="space-y-4">
        {centerBlocks.map((block) => renderBlockComponent(block, "center"))}
      </div>

      {isEditing &&
        (activeWizardColumn === "center" ? (
          <BlockCreatorModal columnKey="center" />
        ) : (
          <Button
            variant="unstyled"
            onClick={() => setActiveWizardColumn("center")}
            className="hover:border-primary/40 border-primary/20 text-primary w-full cursor-pointer rounded-2xl border-2 border-dashed py-5 text-center text-xs font-bold transition-all md:text-sm"
          >
            <Plus /> Añadir bloque
          </Button>
        ))}

      <KnowledgeFeedback initialUserVote={userVote} />
    </div>
  );
}