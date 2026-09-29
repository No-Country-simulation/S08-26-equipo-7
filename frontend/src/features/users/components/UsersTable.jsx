import { CircleX, Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import UsersSkeleton from "@/features/skeleton/UsersSkeleton";
import UsersTableManager from "@/features/users/components/table/UsersTableManager";
import { useUsers } from "@/features/users/context/UsersContext";

export default function UsersTable() {
  const { filteredUsers, isLoading, loadError, refresh, search, roleFilter, areaFilter } = useUsers();

  if (isLoading) return <UsersSkeleton />;

  if (loadError) {
    return (
      <div className="text-muted-foreground flex flex-col items-center px-6 py-12 text-center" role="alert">
        <CircleX aria-hidden="true" className="text-destructive mb-3 size-10" />
        <p className="text-foreground font-medium">No se pudieron cargar los usuarios.</p>
        <p className="mt-1 text-sm">{loadError}</p>
        <Button variant="outline" className="mt-4" onClick={refresh}>Reintentar</Button>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    const hasFilters = Boolean(search.trim()) || roleFilter !== "all" || areaFilter !== "all";
    return (
      <div className="text-muted-foreground flex flex-col items-center px-6 py-14 text-center" role="status">
        <span className="bg-muted mb-4 flex size-14 items-center justify-center rounded-2xl">
          <Inbox aria-hidden="true" className="size-7" />
        </span>
        <p className="text-foreground text-lg font-semibold">
          {hasFilters ? "No hay usuarios con esos filtros" : "Aún no hay usuarios"}
        </p>
        <p className="mt-1 text-sm">
          {hasFilters ? "Prueba a cambiar la búsqueda o los filtros." : "Los usuarios aparecerán aquí cuando se creen."}
        </p>
      </div>
    );
  }

  return <UsersTableManager users={filteredUsers} />;
}
