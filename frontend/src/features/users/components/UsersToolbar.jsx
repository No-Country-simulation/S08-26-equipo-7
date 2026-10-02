import { Search } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers } from "@/features/users/context/UsersContext";
import { getRoleLabel } from "@/i18n/es/roles";

const ROLES = ["ADMIN", "AGENT", "SUPERVISOR", "REQUESTER"];

export default function UsersToolbar() {
  const {
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    areaFilter,
    setAreaFilter,
    departments,
    users,
    filteredUsers,
  } = useUsers();

  const areaNames = new Map(departments.map((department) => [department.code, department.name]));
  const areas = [
    ...new Set([
      ...departments.map((department) => department.code),
      ...users.map((user) => user.area),
    ].filter(Boolean)),
  ].sort((a, b) =>
    (areaNames.get(a) || a).localeCompare(areaNames.get(b) || b, "es"),
  );

  return (
    <div className="border-b p-4 sm:p-5">
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(10rem,12rem)_minmax(10rem,14rem)]">
        <InputGroup className="h-11 min-w-0 border-border sm:col-span-2 lg:col-span-1">
          <InputGroupAddon align="inline-start" className="pl-3">
            <Search aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre o correo..."
            aria-label="Buscar usuarios por nombre o correo"
            className="h-full min-w-0"
          />
          <span
            data-align="inline-end"
            role="status"
            aria-live="polite"
            aria-label={`${filteredUsers.length} resultados`}
            className="text-muted-foreground order-last shrink-0 px-3 text-xs tabular-nums"
          >
            {filteredUsers.length} resultados
          </span>
        </InputGroup>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger aria-label="Filtrar usuarios por rol" className="h-11 w-full min-w-0 rounded-md border border-border">
            <SelectValue placeholder="Todos los roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>{getRoleLabel(role)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger aria-label="Filtrar usuarios por área o departamento" className="h-11 w-full min-w-0 rounded-md border border-border">
            <SelectValue placeholder="Todas las áreas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las áreas</SelectItem>
            {areas.map((area) => (
              <SelectItem key={area} value={area}>{areaNames.get(area) || area}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
