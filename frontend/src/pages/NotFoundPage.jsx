import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

export default function NotFoundPage(){
  return(
    <div>
      <div>Pagina no encontrada</div>
      <Link to="/login">
        <Button type="button" variant="ghost" className="w-full cursor-pointer text-muted-foreground text-md py-5">
          <ArrowLeftIcon className="mr-2 h-4 w-4 " />
          Volver al inicio
        </Button>
      </Link>
    </div>
  );
};