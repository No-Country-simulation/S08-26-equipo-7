import { useEffect, useState } from "react";

import InfoBanner from "@/components/InfoBanner";
import { Skeleton } from "@/components/ui/skeleton";

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
            <div
              className="bg-card border-border h-full space-y-3 rounded-lg border p-4 shadow-md"
              key={index}
              role="status"
              aria-label="Cargando artículo"
            >
              <span className="sr-only">Cargando artículo...</span>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24 bg-muted-foreground/10" />
                <Skeleton className="h-4 w-20 bg-muted-foreground/10" />
              </div>
              <Skeleton className="h-7 w-3/4 bg-muted-foreground/10" />
              <Skeleton className="h-16 w-full bg-muted-foreground/10" />
              <div className="border-border flex items-center justify-between border-t pt-3">
                <Skeleton className="h-4 w-36 bg-muted-foreground/10" />
                <Skeleton className="size-4 bg-muted-foreground/10" />
              </div>
            </div>
          ))
          : knowledge.map((item) => <CardKnowl key={item.id} info={item} />)}
      </div>
    </div>
  );
}
