import { ArrowLeft,FileQuestion } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function KnowledgeNotFound() {

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
      <Button asChild className="mt-2 btn-gradient-primary">
        <Link to="/knowledge"><ArrowLeft />Volver a la Base de Conocimiento</Link>
      </Button>
    </div>
  );
}