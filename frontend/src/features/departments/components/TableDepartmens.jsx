import { CircleX, Inbox } from "lucide-react";

import { useDepartmens } from "@/features/departments/context/DepartmensProvider";
import DepartmensSkeleton from "@/features/skeleton/DepartmensSkeleton";

import TableDepartmensManager from "./TableDepartmensManager";

export default function TableDepartmens() {
  const { departments, isLoading, error, refresh } = useDepartmens();

  return (
    <div className="bg-card border-border my-4 overflow-hidden rounded-lg border shadow-md">
      {isLoading && <DepartmensSkeleton />}

      {!isLoading && error && (
        <div
          className="text-muted-foreground flex flex-col items-center justify-center px-6 py-10 text-center"
          role="alert"
        >
          <CircleX className="text-destructive mb-3 size-10" />
          <p className="text-destructive font-medium">
            No se pudieron cargar los departamentos.
          </p>
          <p className="mt-1 text-xs">{error}</p>
          <button
            type="button"
            onClick={refresh}
            className="text-primary mt-3 text-sm font-semibold underline-offset-4 hover:underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !error && departments.length === 0 && (
        <div
          className="text-muted-foreground flex flex-col items-center justify-center px-6 py-10 text-center"
          role="status"
        >
          <div className="bg-foreground/10 mb-4 flex h-16 w-16 items-center justify-center rounded-lg">
            <Inbox className="size-10" />
          </div>
          <p className="text-2xl font-bold">Sin departamentos</p>
          <p className="text-xs">
            Crea el primero para empezar a clasificar las solicitudes.
          </p>
        </div>
      )}

      {!isLoading && departments.length > 0 && <TableDepartmensManager />}
    </div>
  );
}
