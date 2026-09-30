import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

import { getKnowledgeById, getMyKnowledgeVote } from "@/features/knowledge/service/knowledgeApi";
import { getCategories } from "@/features/tickets/services/categoryApi";

export function useKnowledgeData(id) {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [userVote, setUserVote] = useState(null); // Estado para el voto del usuario

  const isCreating = location.pathname.includes("/knowledge/new") || id === "new";

  const [editForm, setEditForm] = useState({
    titulo: "",
    descripcion: "",
    contenido: "",
    categoria: "",
    activo: true,
    tiempoLecturaMin: "",
    layoutConfig: { columns: { left: [], center: [], right: [] } },
  });
  const [savedForm, setSavedForm] = useState(() => JSON.parse(JSON.stringify(editForm)));

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setNotFound(false);

      if (isCreating) {
        try {
          const categoriesData = await getCategories();
          setCategories(categoriesData);
        } catch (error) {
          console.error("Error al cargar categorías:", error);
        } finally {
          setLoading(false);
        }
        return;
      }
      try {
        const [articleData, categoriesData, voteData] = await Promise.all([
          getKnowledgeById(id),
          getCategories(),
          getMyKnowledgeVote(id).catch(() => ({ megusta: null })), // Fallback si no ha votado o hay error
        ]);

        if (!articleData || !articleData.id) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        let parsedLayout = { columns: { left: [], center: [], right: [] } };

        if (articleData.layoutConfig) {
          if (typeof articleData.layoutConfig === "string") {
            try {
              const parsed = JSON.parse(articleData.layoutConfig);
              parsedLayout = parsed.columns
                ? parsed
                : { columns: parsed.columns || { left: [], center: [], right: [] } };
            } catch (e) {
              console.error("Error parseando layoutConfig string:", e);
            }
          } else if (typeof articleData.layoutConfig === "object") {
            if (articleData.layoutConfig.layoutConfig && articleData.layoutConfig.layoutConfig.columns) {
              parsedLayout = articleData.layoutConfig.layoutConfig;
            } else if (articleData.layoutConfig.columns) {
              parsedLayout = articleData.layoutConfig;
            }
          }
        }
        const loadedForm = { ...articleData, layoutConfig: parsedLayout };
        setEditForm(loadedForm);
        setSavedForm(JSON.parse(JSON.stringify(loadedForm)));
        setCategories(categoriesData);
        const parsedUserVote = voteData?.miVoto ?? voteData?.mivoto ?? voteData?.megusta ?? null;
        setUserVote(parsedUserVote);

      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setNotFound(true);
        toast.error("Error al cargar el artículo.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, isCreating]);

  return { 
    categories, 
    loading, 
    notFound, 
    editForm, 
    setEditForm, 
    savedForm,
    setSavedForm,
    isCreating, 
    userVote
  };
}
