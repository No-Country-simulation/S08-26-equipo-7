import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function ActivityFeed() {
  return (
    <div className="bg-card border-border order-4 flex rounded-lg border p-4 shadow-md">
      <Link to="/tickets" className="mr-4">
        <Button
          variant="ghost"
          className="text-secondary-foreground cursor-pointer"
        >
          <ArrowLeft />
          Volver al Listado
        </Button>
      </Link>
    </div>
  );
}
