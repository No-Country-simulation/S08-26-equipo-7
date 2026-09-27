import { ArrowRight, Clock, Eye, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function CardKnowl({ info }) {
  const viewFormated =
    info.visualizaciones >= 1000
      ? `${(info.visualizaciones / 1000).toFixed(1)}k`
      : info.visualizaciones;

  return (
    <div className="bg-card border-border hover:border-primary/40 relative flex w-full flex-col justify-between rounded-lg border p-4 shadow-md duration-300">
      <div>
        <div className="flex items-center justify-between space-x-1">
          <div className="bg-primary/10 text-primary rounded-md px-2 py-1 text-center text-xs font-semibold">
            {info.categoria}
          </div>
          <div className="text-muted-foreground/50 flex items-center justify-between space-x-1 text-xs font-semibold sm:space-x-2">
            <span className="flex items-center justify-center space-x-1">
              <Clock size="14" />
              <span>{info.tiempoLecturaMin} min lectura</span>
            </span>
            <div className="flex space-x-1 flex-wrap">
              <Eye size="14" />
              <span>{viewFormated}</span>
              <span>lecturas</span>
            </div>
          </div>
        </div>
        
        <h1 className="py-2 text-xl font-bold">{info.titulo}</h1>
        
        <p className="text-muted-foreground bg-muted-foreground/5 mb-2 rounded-sm p-2 text-sm">
          {info.descripcion}
        </p>
      </div>

      <div className="border-border mt-4 flex w-full items-center justify-between border-t pt-3">
        <div className="flex items-center space-x-1">
          <ThumbsUp className="text-success" size="14" />
          <p className="text-muted-foreground/70 text-xs font-bold">
            {info.satisfaccion}% de efectividad{" "}
            <span className="hidden sm:inline">en solución</span>
          </p>
        </div>

        <Link
          to={`/knowledge/${info.id}`}
          className="flex items-center space-x-1"
          aria-label="Leer artículo completo"
        >
          <span className="text-primary font-base hidden text-xs sm:inline sm:text-sm">
            Leer artículo
          </span>
          <ArrowRight size="14" className="text-primary" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}