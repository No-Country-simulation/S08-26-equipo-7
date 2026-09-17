import { Loader2 } from "lucide-react";
export default function LoadingState(){
  return(
    <div className="flex h-screen items-center justify-center" role="status" aria-label="Cargando">
      <Loader2 className="animate-spin" aria-hidden="true" />
      <span className="sr-only">Cargando...</span>
    </div>
  );
}