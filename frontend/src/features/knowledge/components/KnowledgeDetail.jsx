import {
  AlertTriangle,
  FileQuestion,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import AdminPanelBar from "@/features/knowledge/components/Builder/AdminPanelBar";
import CenterColumn from "@/features/knowledge/components/Builder/columns/CenterColumn";
import LeftColumn from "@/features/knowledge/components/Builder/columns/LeftColumn";
import RightColumn from "@/features/knowledge/components/Builder/columns/RightColumn";
import {
  getKnowledgeById,
  updateKnowledge,
} from "@/features/knowledge/service/knowledgeApi";
import KnowledgeDetailSkeleton from "@/features/skeleton/KnowledgeDetailSkeleton";
import { getCategories } from "@/features/tickets/services/categoryApi";

export default function KnowledgeDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const articleFromState = location.state?.knowledge;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!articleFromState);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false); // Estado para el AlertDialog de cancelar edición

  const [editForm, setEditForm] = useState(
    articleFromState || {
      titulo: "",
      descripcion: "",
      contenido: "",
      categoria: "",
      layoutConfig: { columns: { left: [], center: [], right: [] } },
    },
  );

  const originalFormRef = useRef(null);
  const [activeWizardColumn, setActiveWizardColumn] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const categoriesPromise = getCategories();

        if (!articleFromState) {
          setLoading(true);
          const articleData = await getKnowledgeById(id);

          if (!articleData || !articleData.id) {
            setNotFound(true);
            return;
          }

          setEditForm(articleData);
        }

        const cats = await categoriesPromise;
        setCategories(cats);
      } catch (error) {
        setNotFound(true);
        toast.error("El artículo solicitado no existe o fue eliminado." + error.message,{
          className: "bg-foreground! dark:bg-background! text-white!",
        });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, articleFromState]);

  const handleStartEdit = () => {
    originalFormRef.current = JSON.parse(JSON.stringify(editForm));
    setIsEditing(true);
  };

  // Abre el diálogo de confirmación para cancelar
  const handleAttemptCancel = () => {
    setShowCancelDialog(true);
  };

  // Confirma el descarte y restaura el estado original
  const handleConfirmCancel = () => {
    if (originalFormRef.current) {
      setEditForm(originalFormRef.current);
    }
    setIsEditing(false);
    setActiveWizardColumn(null);
    setShowCancelDialog(false);

    // Toast de advertencia personalizado con Sonner
    toast.error("Edición cancelada", {
      description: "Se han descartado los cambios no guardados.",
      className: "bg-foreground! dark:bg-background! text-white!",
    });
  };

  const handleDeleteBlock = (colKey, blockId) => {
    const currentColumns = editForm.layoutConfig?.columns || {
      left: [],
      center: [],
      right: [],
    };
    const updatedCol = (currentColumns[colKey] || []).filter(
      (b) => b.id !== blockId,
    );

    setEditForm({
      ...editForm,
      layoutConfig: {
        ...editForm.layoutConfig,
        columns: { ...currentColumns, [colKey]: updatedCol },
      },
    });

    toast("Bloque eliminado", {
      description: "El bloque se ha removido de la columna.",
      className: "bg-foreground! dark:bg-background! text-white!",
    });
  };

  const handleUpdateBlockField = (colKey, blockId, field, value) => {
    const currentColumns = editForm.layoutConfig?.columns || {
      left: [],
      center: [],
      right: [],
    };
    const updatedCol = (currentColumns[colKey] || []).map((b) =>
      b.id === blockId ? { ...b, [field]: value } : b,
    );

    setEditForm({
      ...editForm,
      layoutConfig: {
        ...editForm.layoutConfig,
        columns: { ...currentColumns, [colKey]: updatedCol },
      },
    });
  };

  const handleCreateBlockFromModal = (
    colKey,
    { type, title, initialContent },
  ) => {
    const newBlock = {
      id: `${colKey}-${Date.now()}`,
      type,
      title,
      content: ["warning", "code"].includes(type)
        ? initialContent || "Escriba el contenido aquí..."
        : undefined,
      items:
        type === "steps" ? [initialContent || "Paso inicial 1"] : undefined,
      links:
        type === "navigation"
          ? [{ label: initialContent || "Enlace rápido", url: "#" }]
          : undefined,
    };

    const currentLayout = editForm.layoutConfig || {};
    const currentColumns = currentLayout.columns || {
      left: [],
      center: [],
      right: [],
    };
    const targetColumn = currentColumns[colKey] || [];

    setEditForm({
      ...editForm,
      layoutConfig: {
        ...currentLayout,
        columns: {
          ...currentColumns,
          [colKey]: [...targetColumn, newBlock],
        },
      },
    });

    setActiveWizardColumn(null);

    // Toast de éxito personalizado con Sonner al crear un bloque nuevo
    toast.success("¡Bloque añadido con éxito!", {
      description: `Se agregó un nuevo bloque de tipo "${type}" en la columna ${colKey}.`,
      className: "bg-foreground! dark:bg-background! text-white!",
    });
  };

  const handleSaveChanges = async () => {
    if (!editForm.titulo?.trim()) {
      toast.error("Campo obligatorio", {
        description: "El artículo debe tener un título válido.",
      });
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        titulo: editForm.titulo,
        descripcion: editForm.descripcion,
        contenido: editForm.contenido,
        categoria: editForm.categoria,
        tiempoLecturaMin: editForm.tiempoLecturaMin || 1,
        activo: editForm.activo ?? true,
        layoutConfig: editForm.layoutConfig,
      };

      await updateKnowledge(id, payload);

      toast.success("¡Cambios guardados!", {
        description:
          "El artículo se ha actualizado correctamente en el servidor.",
        className: "bg-foreground! dark:bg-background! text-white!",
      });

      setIsEditing(false);
      originalFormRef.current = null;
    } catch (error) {
      console.error("Error al actualizar artículo:", error);
      toast.error("Error de servidor", {
        description: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
        className: "bg-foreground! dark:bg-background! text-white!"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <KnowledgeDetailSkeleton />;

  if (notFound) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center space-y-4 p-6 text-center">
        <div className="bg-destructive/15 text-destructive flex h-16 w-16 items-center justify-center rounded-full">
          <FileQuestion size={32} />
        </div>
        <h1 className="text-2xl font-bold">Artículo no encontrado</h1>
        <p className="text-muted-foreground text-sm">
          El recurso que intentas consultar no existe, la URL es incorrecta o
          fue dado de baja.
        </p>
        <Button onClick={() => navigate("/knowledge")} className="mt-2">
          Volver a la Base de Conocimiento
        </Button>
      </div>
    );
  }

  const columns = editForm.layoutConfig?.columns || {
    left: [],
    center: [],
    right: [],
  };

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 font-sans">
      <AdminPanelBar
        isAdmin={isAdmin}
        isEditing={isEditing}
        isSaving={isSaving}
        onStartEdit={handleStartEdit}
        onCancelEdit={handleAttemptCancel} // Abre el diálogo de confirmación
        onSave={handleSaveChanges}
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-4">
        <LeftColumn
          columns={columns}
          isEditing={isEditing}
          activeWizardColumn={activeWizardColumn}
          setActiveWizardColumn={setActiveWizardColumn}
          onDeleteBlock={handleDeleteBlock}
          onUpdateBlockField={handleUpdateBlockField}
          handleCreateBlockFromModal={handleCreateBlockFromModal}
        />

        <CenterColumn
          columns={columns}
          isEditing={isEditing}
          editForm={editForm}
          setEditForm={setEditForm}
          categories={categories}
          activeWizardColumn={activeWizardColumn}
          setActiveWizardColumn={setActiveWizardColumn}
          onDeleteBlock={handleDeleteBlock}
          onUpdateBlockField={handleUpdateBlockField}
          handleCreateBlockFromModal={handleCreateBlockFromModal}
        />

        <RightColumn
          columns={columns}
          isEditing={isEditing}
          activeWizardColumn={activeWizardColumn}
          setActiveWizardColumn={setActiveWizardColumn}
          onDeleteBlock={handleDeleteBlock}
          onUpdateBlockField={handleUpdateBlockField}
          handleCreateBlockFromModal={handleCreateBlockFromModal}
        />
      </div>

      {/* AlertDialog de Shadcn para confirmar la cancelación de la edición general */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                <AlertTriangle size={20} />
              </div>
              <AlertDialogTitle className="text-lg font-bold">
                ¿Descartar cambios?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground pt-2 text-sm">
              Tienes modificaciones sin guardar en este artículo. Si cancelas,
              se perderán todos los cambios realizados en esta sesión de
              edición.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel onClick={() => setShowCancelDialog(false)} className="py-4!">
              Continuar editando
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-destructive! py-4! "
            >
              Sí, descartar cambios
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
