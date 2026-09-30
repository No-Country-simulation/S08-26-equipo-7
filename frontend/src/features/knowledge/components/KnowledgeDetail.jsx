import { useParams } from "react-router-dom";

import { useAuth } from "@/features/auth/hooks/useAuth";
import AdminPanelBar from "@/features/knowledge/components/Builder/AdminPanelBar";
import CenterColumn from "@/features/knowledge/components/Builder/columns/CenterColumn";
import LeftColumn from "@/features/knowledge/components/Builder/columns/LeftColumn";
import RightColumn from "@/features/knowledge/components/Builder/columns/RightColumn";
import ConfirmActionDialog from "@/features/knowledge/components/ConfirmActionDialog";
import KnowledgeNotFound from "@/features/knowledge/components/KnowledgeNotFound";
import { KnowledgeProvider } from "@/features/knowledge/context/KnowledgeContext";
import { useKnowledgeActions } from "@/features/knowledge/hooks/useKnowledgeActions";
import { useKnowledgeBlocks } from "@/features/knowledge/hooks/useKnowledgeBlocks";
import { useKnowledgeData } from "@/features/knowledge/hooks/useKnowledgeData";
import { useKnowledgeForm } from "@/features/knowledge/hooks/useKnowledgeForm";
import KnowledgeDetailSkeleton from "@/features/skeleton/KnowledgeDetailSkeleton";

export default function KnowledgeDetail() {
  const { id } = useParams();
  const { isAdmin } = useAuth();

  const knowledgeData = useKnowledgeData(id);
  const blockActions = useKnowledgeBlocks(
    knowledgeData.editForm,
    knowledgeData.setEditForm,
  );
  const formActions = useKnowledgeForm(
    id,
    knowledgeData.editForm,
    knowledgeData.setEditForm,
  );
  const actionHandlers = useKnowledgeActions(
    id,
    knowledgeData.editForm,
    knowledgeData.setEditForm,
  );

  if (knowledgeData.loading) {
    return <KnowledgeDetailSkeleton />;
  }
  if (knowledgeData.notFound) return <KnowledgeNotFound />;

  const columns = knowledgeData.editForm.layoutConfig?.columns || {
    left: [],
    center: [],
    right: [],
  };

  const contextValue = {
    ...knowledgeData,
    ...blockActions,
    ...formActions,
    ...actionHandlers,
    columns,
    isAdmin,
  };

  return (
    <KnowledgeProvider value={contextValue}>
      <div className="mx-auto min-h-[70vh] max-w-7xl space-y-4 p-4 font-sans">
        <AdminPanelBar />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-4">
          <LeftColumn />
          <CenterColumn />
          <RightColumn />
        </div>

        <ConfirmActionDialog
          open={formActions.showCancelDialog}
          onOpenChange={formActions.setShowCancelDialog}
          onConfirm={formActions.handleConfirmCancel}
          title="¿Descartar cambios?"
          description="Tienes modificaciones sin guardar en este artículo. Si cancelas, se perderán todos los cambios realizados en esta sesión de edición."
          confirmText="Sí, descartar cambios"
          cancelText="Continuar editando"
          variant="warning"
        />

        <ConfirmActionDialog
          open={actionHandlers.showDeleteDialog}
          onOpenChange={actionHandlers.setShowDeleteDialog}
          onConfirm={actionHandlers.handleConfirmDelete}
          title="¿Eliminar artículo?"
          description="Esta acción eliminará permanentemente este artículo de la base de conocimiento. No se podrá recuperar."
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          variant="destructive"
        />
      </div>
    </KnowledgeProvider>
  );
}
