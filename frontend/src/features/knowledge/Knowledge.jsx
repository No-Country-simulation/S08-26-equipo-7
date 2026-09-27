import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import InfoBanner from "@/components/InfoBanner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import KnowledgeSkeleton from "@/features/skeleton/KnowledgeSkeleton";

import CardKnowl from "./components/CardKnowl";
import { getKnowledge } from "./service/knowledgeApi";

async function fetchKnowledge() {
  const knowledge = await getKnowledge();
  return knowledge;
}

export default function Knowledge() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKnowledge()
      .then(setKnowledge)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 font-sans">
      <InfoBanner
        title="Base de Conocimiento & Auto-Servicio"
        paragraph="Consulte guías oficiales y resuelva requerimientos frecuentes sin necesidad de abrir un ticket."
      />

      {isAdmin && (
        <div className="flex justify-end">
          <Button
            onClick={() => navigate("/knowledge/new")}
            className="btn-gradient-primary cursor-pointer gap-2 rounded-lg px-4"
          >
            <Plus size={16} />
            Nuevo Artículo
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {loading
          ? Array.from({ length: 4 }, (_, index) => (
            <KnowledgeSkeleton key={index} />
          ))
          : knowledge.map((item) => <CardKnowl key={item.id} info={item} />)}
      </div>
    </div>
  );
}
