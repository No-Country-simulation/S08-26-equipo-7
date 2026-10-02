import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import ChangePasswordDialog from "@/features/users/components/ChangePasswordDialog";
import UserFormDialog from "@/features/users/components/UserFormDialog";
import UsersSummary from "@/features/users/components/UsersSummary";
import UsersTable from "@/features/users/components/UsersTable";
import UsersToolbar from "@/features/users/components/UsersToolbar";
import UsersProvider, { useUsers } from "@/features/users/context/UsersContext";

function UsersPageContent() {
  const { openCreateDialog } = useUsers();

  return (
    <div className="space-y-4 py-4">
      <UsersSummary />
      <section className="bg-card border-border overflow-hidden rounded-xl border shadow-sm">
        <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Usuarios</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Administra las cuentas y sus permisos de acceso.
            </p>
          </div>
          <Button onClick={openCreateDialog} className="btn-gradient-primary w-full rounded-md sm:w-auto">
            <Plus aria-hidden="true" />
            Nuevo usuario
          </Button>
        </div>
        <UsersToolbar />
      </section>
      <section
        aria-label="Tabla de usuarios"
        className="bg-card border-border overflow-hidden rounded-xl border shadow-sm"
      >
        <UsersTable />
      </section>
      <UserFormDialog />
      <ChangePasswordDialog />
    </div>
  );
}

export default function Users() {
  return (
    <UsersProvider>
      <UsersPageContent />
    </UsersProvider>
  );
}
