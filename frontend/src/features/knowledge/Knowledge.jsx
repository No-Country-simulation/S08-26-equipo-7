import { useEffect,useState } from "react";

import InfoBanner from "@/components/InfoBanner";

import CardKnowl from "./components/CardKnowl";
import { getKnowledge } from "./service/knowledgeApi";

async function fetchKnowledge() {
  const knowledge = await getKnowledge();
  return knowledge;
}
  
export default function Knowledge() {
  const [knowledge, setKnowledge] = useState([]);
  useEffect(() => {
    fetchKnowledge().then(setKnowledge);
  }, []);
  return (
    <div>
      <InfoBanner title="Base de Conocimiento & Auto-Servicio" paragraph="Consulte guías oficiales y resuelva requerimientos frecuentes sin necesidad de abrir un ticket." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {knowledge.map((item) => (
          <CardKnowl key={item.id} info={item} />
        ))}
      </div>
    </div>
  );
}