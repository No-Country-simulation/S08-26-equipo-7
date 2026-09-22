import { useEffect, useState } from "react";

import InfoBanner from "@/components/InfoBanner";
import KnowledgeSkeleton from "@/features/skeleton/KnowledgeSkeleton";

import CardKnowl from "./components/CardKnowl";
import { getKnowledge } from "./service/knowledgeApi";

async function fetchKnowledge() {
  const knowledge = await getKnowledge();
  return knowledge;
}

export default function Knowledge() {
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKnowledge()
      .then(setKnowledge)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <InfoBanner
        title="Base de Conocimiento & Auto-Servicio"
        paragraph="Consulte guías oficiales y resuelva requerimientos frecuentes sin necesidad de abrir un ticket."
      />
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
