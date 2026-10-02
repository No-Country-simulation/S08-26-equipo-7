import { KeyRound, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import UserAvatar from "@/features/users/components/UserAvatar";
import { useUsers } from "@/features/users/context/UsersContext";
import { getRoleLabel } from "@/i18n/es/roles";

const ROLE_CLASSES = {
  ADMIN: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
  AGENT: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
  SUPERVISOR: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-800 dark:bg-fuchsia-950/40 dark:text-fuchsia-300",
  REQUESTER: "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function RoleBadge({ role }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${ROLE_CLASSES[role] || ROLE_CLASSES.REQUESTER}`}>
      {getRoleLabel(role)}
    </span>
  );
}

function UserActions({ user, onEdit, onChangePassword }) {
  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" className="size-11 rounded-md" aria-label={`Cambiar contraseña de ${user.name}`} title="Cambiar contraseña" onClick={() => onChangePassword(user)}>
        <KeyRound aria-hidden="true" className="size-4" />
      </Button>
      <Button variant="ghost" size="icon" className="size-11 rounded-md" aria-label={`Editar usuario ${user.name}`} title="Editar usuario" onClick={() => onEdit(user)}>
        <Pencil aria-hidden="true" className="size-4" />
      </Button>
    </div>
  );
}

export default function DesktopUsersTable({ users }) {
  const { departments, openEditDialog, requestPasswordChange } = useUsers();
  const departmentNames = new Map(departments.map((department) => [department.code, department.name]));

  return (
    <Table>
      <caption className="sr-only">Usuarios, su rol, área y acciones disponibles</caption>
      <TableHeader className="bg-muted/40">
        <TableRow>
          <TableHead className="w-[34%] px-5 text-xs font-bold tracking-wide uppercase">Usuario</TableHead>
          <TableHead className="w-[17%] text-xs font-bold tracking-wide uppercase">Rol</TableHead>
          <TableHead className="w-[29%] text-xs font-bold tracking-wide uppercase">Área / departamento</TableHead>
          <TableHead className="w-[20%] pr-5 text-right text-xs font-bold tracking-wide uppercase">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="px-5 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <UserAvatar name={user.name} />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{user.name}</p>
                  <a className="text-muted-foreground hover:text-primary block truncate text-sm focus-visible:rounded-sm focus-visible:outline-2" href={`mailto:${user.email}`}>
                    {user.email}
                  </a>
                </div>
              </div>
            </TableCell>
            <TableCell><RoleBadge role={user.role} /></TableCell>
            <TableCell className="whitespace-normal">{departmentNames.get(user.area) || user.area || <span className="text-muted-foreground">Sin área</span>}</TableCell>
            <TableCell className="pr-5">
              <UserActions user={user} onEdit={openEditDialog} onChangePassword={requestPasswordChange} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
