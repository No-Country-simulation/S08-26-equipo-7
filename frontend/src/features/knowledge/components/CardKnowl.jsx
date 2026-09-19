import { Eye, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CardKnowl({ info }) {
  const viewFormated =
    info.visualizaciones >= 1000
      ? `${(info.visualizaciones / 1000).toFixed(1)}k`
      : info.visualizaciones;

  return (
    <Link to={`/knowledge/${info.id}`} state={{ knowledge: info }}>
      <div className="bg-card border-border hover:border-primary/40 h-full w-full space-y-2 rounded-lg border p-4 shadow-md duration-300">
        <div className="flex items-center justify-between">
          <div className="bg-primary/10 text-primary rounded-md px-2 py-1 text-center text-xs font-semibold">
            {info.categoria}
          </div>
          <div className="text-muted-foreground/50 flex space-x-1 text-xs font-semibold">
            <Eye size="14" />
            <span>{viewFormated}</span>
            <span>lecturas</span>
          </div>
        </div>
        <h1 className="text-xl font-bold">{info.titulo}</h1>
        <p className="text-muted-foreground bg-muted-foreground/5 rounded-sm px-4 text-sm">
          {info.descripcion}
        </p>
        <div className="border-border flex w-full items-center justify-between border-t py-2">
          <p className="text-primary font-base text-sm">
            Leer artículo completo
          </p>
          <MoveRight size="14" className="text-primary" />
        </div>
      </div>
    </Link>
  );
}