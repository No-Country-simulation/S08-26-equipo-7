import { ArrowLeft, Calendar, Clock, ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CreateDialog from "@/features/tickets/components/dialogs/CreateDialog";

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
      <div
        className="bg-card border-border space-y-4 rounded-lg border p-6 shadow-md"
        role="status"
        aria-label="Cargando artículo"
      >
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
    <article className="bg-card border-border my-4 space-y-4 rounded-lg border p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <Link className="text-primary flex space-x-2 text-sm" to="/knowledge">
          <ArrowLeft />
          <p>Volver a la base de conocimiento</p>
        </Link>

        <div className="flex items-center space-x-2 text-sm">
          <span className="text-primary bg-primary/10 w-fit rounded-md px-2 py-1 font-semibold">
            {knowledge.categoria}
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Clock size="14" className="text-primary" />{" "}
            <span className="text-muted-foreground/70">4 min lectura</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1 text-muted-foreground/70">
            <Calendar size="14" />
            <span>
              Actualizado: 12 Sep 2026
            </span>
          </span>
        </div>
      </div>
      <h1 className="text-3xl font-bold">{knowledge.titulo}</h1>
      <p className="text-muted-foreground">{knowledge.descripcion}</p>
      <ol className="list-inside list-decimal space-y-2">
        {knowledge.contenido
          .split(/\\n|\n/)
          .filter(Boolean)
          .map((paso, index) => (
            <li key={index} className="text-gray-700">
              {paso.replace(/^\d+\.\s*/, "")}
            </li>
          ))}
      </ol>
      <div className="border-border flex items-center justify-between border-t pt-4">
        <div className="flex flex-col">
          <p className="font-semibold">
            ¿Resolvió su requerimiento sin requerir soporte?
          </p>
          <p className="text-muted-foreground/70 text-xs">
            96% de efectividad (142 votos confirmados).
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="bg-muted cursor-pointer">
            <ThumbsUp className="text-success mr-2" />
            Si, resuelto
          </Button>
          <CreateDialog
            trigger={
              <Button variant="outline" className="bg-muted cursor-pointer">
                <ThumbsDown className="text-destructive mr-2" />
                Abrir ticket
              </Button>
            }
          />
        </div>
      </div>
    </article>
  );
}
