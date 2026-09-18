import { Eye, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
export default function CardKnowl({info}) {

  const viewFormated = (info.visualizaciones >= 1000 ? (info.visualizaciones / 1000).toFixed(1) + "k" : info.visualizaciones); 
  return (
    <Link>
      <div className="bg-card border-border rounded-lg border p-4 w-full h-full shadow-md space-y-2 hover:border-primary/40 duration-300">
        <div className="flex justify-between items-center">
          <div className="px-2 py-1 bg-primary/10 rounded-md text-primary text-center text-xs font-semibold">{info.categoria}</div>
          <div className="flex text-muted-foreground/50 font-semibold space-x-1 text-xs">
            <Eye size="14" />
            <span>{viewFormated}</span>
            <span>lecturas</span>
          </div>
        </div>
        <h1 className="text-xl font-bold">{info.titulo}</h1>
        <p className="text-sm text-muted-foreground bg-muted-foreground/5 px-4 rounded-sm">{info.descripcion}</p>
        <div className="w-full border-t border-border py-2 flex justify-between items-center">
          <p className="text-primary text-sm font-base">Leer artículo completo</p>
          <MoveRight size="14" className="text-primary" />
        </div>
      </div>
    </Link>
  );
}