import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ActionCellDepartmens from "@/features/departments/components/ActionCellDepartmens";
import {
  ApprovalBadge,
  StatusBadge,
} from "@/features/departments/components/DepartmentBadges";
import { useDepartmens } from "@/features/departments/context/DepartmensProvider";

export default function TableDepartmensDesktop() {
  const { departments } = useDepartmens();

  return (
    <Table>
      <TableHeader className="bg-muted-foreground/5">
        <TableRow>
          <TableHead className="text-muted-foreground text-center text-xs font-bold">
            CÓDIGO
          </TableHead>
          <TableHead className="text-muted-foreground text-xs font-bold">
            NOMBRE Y DESCRIPCIÓN
          </TableHead>
          <TableHead className="text-muted-foreground text-center text-xs font-bold">
            REQUIERE APROBACIÓN
          </TableHead>
          <TableHead className="text-muted-foreground text-center text-xs font-bold">
            ESTADO
          </TableHead>
          <TableHead className="text-muted-foreground text-center text-xs font-bold">
            ACCIONES
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments.map((department) => (
          <TableRow
            key={department.id}
            className="hover:bg-muted-foreground/10"
          >
            <TableCell className="pl-4 font-semibold tracking-wide">
              {department.code}
            </TableCell>
            <TableCell>
              <span className="font-semibold">{department.name}</span>
              {department.description ? (
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {department.description}
                </p>
              ) : null}
            </TableCell>
            <TableCell className="text-center">
              <ApprovalBadge requiresApproval={department.requiresApproval} />
            </TableCell>
            <TableCell className="text-center">
              <StatusBadge active={department.active} />
            </TableCell>
            <TableCell>
              <div className="flex justify-center">
                <ActionCellDepartmens department={department} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
