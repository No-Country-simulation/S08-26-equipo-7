import { Loader2, PenLine, Power } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDepartmens } from "@/features/departments/context/DepartmensProvider";

export default function ActionCellDepartmens({
  department,
  mobileView = false,
}) {
  const { openEdit, requestToggle, toggleTarget, isToggling } = useDepartmens();
  const isThisToggling = isToggling && toggleTarget?.id === department.id;

  return (
    <div className={`flex items-center gap-1 ${mobileView ? "flex-wrap" : ""}`}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={mobileView ? "sm" : "icon"}
            className="text-muted-foreground hover:text-warning"
            onClick={() => openEdit(department)}
            aria-label={`Editar ${department.name}`}
          >
            <PenLine />
            {mobileView && <span>Editar</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Editar departamento</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={mobileView ? "sm" : "icon"}
            className={
              department.active
                ? "text-muted-foreground hover:text-destructive"
                : "text-muted-foreground hover:text-success"
            }
            onClick={() => requestToggle(department)}
            disabled={isThisToggling}
            aria-label={
              department.active
                ? `Desactivar ${department.name}`
                : `Activar ${department.name}`
            }
          >
            {isThisToggling ? <Loader2 className="animate-spin" /> : <Power />}
            {mobileView && (
              <span>{department.active ? "Desactivar" : "Activar"}</span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {department.active ? "Desactivar" : "Activar"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
