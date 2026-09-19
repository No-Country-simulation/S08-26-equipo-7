import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";

import { getKnowledgeById } from "./service/knowledgeApi";

export default function KnowledgeDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const knowledgeFromState = state?.knowledge;
  const [knowledgeFromApi, setKnowledgeFromApi] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!knowledgeFromState);
  const knowledge = knowledgeFromState ?? knowledgeFromApi;

  useEffect(() => {
    if (knowledgeFromState) {
      return;
    }

    getKnowledgeById(id)
      .then(setKnowledgeFromApi)
      .catch(() => setError("No se pudo cargar el artículo."))
      .finally(() => setLoading(false));
  }, [id, knowledgeFromState]);

  if (loading) {
    return (
      <div className="bg-card border-border space-y-4 rounded-lg border p-6 shadow-md" role="status" aria-label="Cargando artículo">
        <span className="sr-only">Cargando artículo...</span>
        <Skeleton className="bg-muted-foreground/10 h-6 w-24" />
        <Skeleton className="bg-muted-foreground/10 h-10 w-3/4" />
        <Skeleton className="bg-muted-foreground/10 h-24 w-full" />
      </div>
    );
  }

  if (error || !knowledge) {
    return (
      <p className="text-destructive" role="alert">
        {error ?? "No se encontró el artículo."}
      </p>
    );
  }

  return (
    <article className="bg-card border-border space-y-4 rounded-lg border p-6 shadow-md">
      <Link className="text-primary text-sm" to="/knowledge">
        Volver a la base de conocimiento
      </Link>
      <div className="text-primary bg-primary/10 w-fit rounded-md px-2 py-1 text-xs font-semibold">
        {knowledge.categoria}
      </div>
      <h1 className="text-3xl font-bold">{knowledge.titulo}</h1>
      <p className="text-muted-foreground">{knowledge.descripcion}</p>
    </article>
  );
}