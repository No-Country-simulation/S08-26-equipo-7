import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "@/features/auth/hooks/useAuth";
import AdminPanelBar from "@/features/knowledge/components/Builder/AdminPanelBar";
import CenterColumn from "@/features/knowledge/components/Builder/columns/CenterColumn";
import LeftColumn from "@/features/knowledge/components/Builder/columns/LeftColumn";
import RightColumn from "@/features/knowledge/components/Builder/columns/RightColumn";
import { initialMockArticle } from "@/features/knowledge/data/mockArticle";
import KnowledgeDetailSkeleton from "@/features/skeleton/KnowledgeDetailSkeleton";
import { getCategories } from "@/features/tickets/services/categoryApi";

export default function KnowledgeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN' || user?.rol === 'administrador';
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [editForm, setEditForm] = useState(initialMockArticle);
  
  // Control del wizard directamente en el componente principal
  const [activeWizardColumn, setActiveWizardColumn] = useState(null);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error al cargar categorías", err));
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Lógica directa de bloques sin hooks intermedios
  const handleDeleteBlock = (colKey, blockId) => {
    const currentColumns = editForm.layoutConfig?.columns || { left: [], center: [], right: [] };
    const updatedCol = (currentColumns[colKey] || []).filter(b => b.id !== blockId);
    
    setEditForm({
      ...editForm,
      layoutConfig: {
        ...editForm.layoutConfig,
        columns: { ...currentColumns, [colKey]: updatedCol }
      }
    });
  };

  const handleUpdateBlockField = (colKey, blockId, field, value) => {
    const currentColumns = editForm.layoutConfig?.columns || { left: [], center: [], right: [] };
    const updatedCol = (currentColumns[colKey] || []).map(b => 
      b.id === blockId ? { ...b, [field]: value } : b
    );
    
    setEditForm({
      ...editForm,
      layoutConfig: {
        ...editForm.layoutConfig,
        columns: { ...currentColumns, [colKey]: updatedCol }
      }
    });
  };

  const handleCreateBlockFromModal = (colKey, { type, title, initialContent }) => {
    const newBlock = {
      id: `${colKey}-${Date.now()}`,
      type: type,
      title: title,
      content: ['warning', 'code'].includes(type) ? initialContent || 'Escriba el contenido aquí...' : undefined,
      items: type === 'steps' ? [initialContent || 'Paso inicial 1'] : undefined,
      links: type === 'navigation' ? [{ label: initialContent || 'Enlace rápido', url: '#' }] : undefined
    };

    const currentLayout = editForm.layoutConfig || {};
    const currentColumns = currentLayout.columns || { left: [], center: [], right: [] };
    const targetColumn = currentColumns[colKey] || [];

    setEditForm({
      ...editForm,
      layoutConfig: {
        ...currentLayout,
        columns: {
          ...currentColumns,
          [colKey]: [...targetColumn, newBlock]
        }
      }
    });

    setActiveWizardColumn(null);
    showNotification("¡Bloque añadido con éxito!", "success");
  };

  const handleSaveChanges = () => {
    if (!editForm.titulo?.trim()) {
      showNotification("El artículo debe tener un título obligatorio.", "error");
      return;
    }
    showNotification("¡Cambios guardados con éxito!", "success");
    setIsEditing(false);
  };

  if (loading) return <KnowledgeDetailSkeleton />;

  const columns = editForm.layoutConfig?.columns || { left: [], center: [], right: [] };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4 font-sans">
      {notification && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-destructive'}`}>
          {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      <AdminPanelBar 
        isAdmin={isAdmin}
        isEditing={isEditing}
        onStartEdit={() => setIsEditing(true)}
        onCancelEdit={() => { setIsEditing(false); setActiveWizardColumn(null); }}
        onSave={handleSaveChanges}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
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
    </div>
  );
}