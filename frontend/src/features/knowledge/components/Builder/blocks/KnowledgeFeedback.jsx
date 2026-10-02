import { Loader2, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useKnowledgeContext } from "@/features/knowledge/context/KnowledgeContext";
import {
  removeKnowledgeVote,
  voteKnowledge,
} from "@/features/knowledge/service/knowledgeApi";
import CreateDialog from "@/features/tickets/components/dialogs/CreateDialog";

export default function KnowledgeFeedback() {
  const { id: articleId } = useParams();
  const { editForm, userVote } = useKnowledgeContext();
  const [megusta, setMegusta] = useState(editForm?.megusta || 0);
  const [nomegusta, setNomegusta] = useState(editForm?.nomegusta || 0);
  const [miVoto, setMiVoto] = useState(userVote);
  const [isLoading, setIsLoading] = useState(false);

  const totalVotes = megusta + nomegusta;
  const satisfaccion =
    totalVotes > 0 ? Math.round((megusta / totalVotes) * 100) : 0;

  const handleVote = async (nuevoVoto) => {
    if (!articleId || articleId === "new") {
      toast.error("Guarda el artículo antes de emitir votos.");
      return;
    }

    try {
      setIsLoading(true);

      if (miVoto === nuevoVoto) {
        const response = await removeKnowledgeVote(articleId);
        setMiVoto(null);

        if (response && typeof response.megusta === "number") {
          setMegusta(response.megusta);
          setNomegusta(response.nomegusta);
        } else {
          if (nuevoVoto === true) setMegusta((prev) => Math.max(0, prev - 1));
          else setNomegusta((prev) => Math.max(0, prev - 1));
        }

        toast.success("Voto retirado", {
          className: "bg-foreground! dark:bg-background! text-white!",
        });
      } else {
        const response = await voteKnowledge(articleId, nuevoVoto);
        setMiVoto(nuevoVoto);

        if (response) {
          setMegusta(response.megusta ?? megusta);
          setNomegusta(response.nomegusta ?? nomegusta);
        }

        toast.success(
          nuevoVoto
            ? "¡Gracias por tu feedback positivo!"
            : "Voto registrado. Ayúdanos creando un ticket.",
          { className: "bg-foreground! dark:bg-background! text-white!" },
        );
      }
    } catch (error) {
      console.error("Error al procesar el voto:", error);
      toast.error("No se pudo procesar tu voto. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border-border flex min-w-0 flex-col items-center justify-between gap-2 rounded-lg border px-4 py-5 shadow-md sm:px-6 lg:flex-row">
      <div className="min-w-0 flex-1 text-center lg:text-left">
        <p className="text-sm font-semibold">¿Resolvió su requerimiento?</p>
        <p className="text-muted-foreground/70 text-xs">
          {satisfaccion}% efectividad ({totalVotes} votos confirmados)
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={() => handleVote(true)}
          className={`cursor-pointer gap-1 transition-all ${
            miVoto === true
              ? "bg-success/20 text-success border-success hover:bg-success/30 font-bold"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          {isLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <ThumbsUp className="text-success" size={14} />
          )}
          Sí
        </Button>

        <CreateDialog
          trigger={
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => handleVote(false)}
              className={`cursor-pointer gap-1 transition-all ${
                miVoto === false
                  ? "bg-destructive/20 text-destructive border-destructive hover:bg-destructive/30 font-bold"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ThumbsDown className="text-destructive" size={14} />
              )}
              Ticket
            </Button>
          }
        />
      </div>
    </div>
  );
}
