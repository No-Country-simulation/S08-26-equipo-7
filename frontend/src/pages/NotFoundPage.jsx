import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div>
      <div>Pagina no encontrada</div>
      <Link to="/login">
        <Button
          type="button"
          variant="ghost"
          className="text-muted-foreground text-md w-full cursor-pointer py-5"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Volver al inicio
        </Button>
      </Link>
    </div>
  );
}
