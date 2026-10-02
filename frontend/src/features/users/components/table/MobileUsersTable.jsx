import { KeyRound, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/features/users/components/table/DesktopUsersTable";
import UserAvatar from "@/features/users/components/UserAvatar";
import { useUsers } from "@/features/users/context/UsersContext";

export default function MobileUsersTable({ users }) {
  const { departments, openEditDialog, requestPasswordChange } = useUsers();
  const departmentNames = new Map(departments.map((department) => [department.code, department.name]));

  return (
    <ul className="divide-y">
      {users.map((user) => (
        <li key={user.id} className="p-4 sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar name={user.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{user.name}</p>
              <a className="text-muted-foreground block truncate text-sm" href={`mailto:${user.email}`}>{user.email}</a>
            </div>
            <RoleBadge role={user.role} />
          </div>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <dt className="text-muted-foreground">Área</dt>
            <dd className="min-w-0 truncate">{departmentNames.get(user.area) || user.area || "Sin área"}</dd>
          </dl>
          <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(min(100%,11rem),1fr))] gap-2">
            <Button variant="outline" size="sm" className="h-11 w-full min-w-0 rounded-md" onClick={() => requestPasswordChange(user)}>
              <KeyRound aria-hidden="true" />
              Cambiar contraseña
            </Button>
            <Button variant="outline" size="sm" className="h-11 w-full min-w-0 rounded-md" aria-label={`Editar usuario ${user.name}`} onClick={() => openEditDialog(user)}>
              <Pencil aria-hidden="true" />
              Editar
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
