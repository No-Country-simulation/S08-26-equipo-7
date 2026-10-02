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
    <Table className="table-fixed">
      <TableHeader className="bg-muted-foreground/5">
        <TableRow>
          <TableHead className="text-muted-foreground w-[14%] text-center text-xs font-bold whitespace-normal">
            CÓDIGO
          </TableHead>
          <TableHead className="text-muted-foreground w-[34%] text-xs font-bold whitespace-normal">
            NOMBRE Y DESCRIPCIÓN
          </TableHead>
          <TableHead className="text-muted-foreground w-[22%] text-center text-xs font-bold whitespace-normal">
            REQUIERE APROBACIÓN
          </TableHead>
          <TableHead className="text-muted-foreground w-[14%] text-center text-xs font-bold whitespace-normal">
            ESTADO
          </TableHead>
          <TableHead className="text-muted-foreground w-[16%] text-center text-xs font-bold whitespace-normal">
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
            <TableCell className="w-[14%] whitespace-normal [overflow-wrap:anywhere] pl-4 font-semibold tracking-wide">
              {department.code}
            </TableCell>
            <TableCell className="w-[34%] min-w-0 whitespace-normal [overflow-wrap:anywhere]">
              <span className="font-semibold">{department.name}</span>
              {department.description ? (
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {department.description}
                </p>
              ) : null}
            </TableCell>
            <TableCell className="w-[22%] whitespace-normal text-center">
              <ApprovalBadge requiresApproval={department.requiresApproval} />
            </TableCell>
            <TableCell className="w-[14%] whitespace-normal text-center">
              <StatusBadge active={department.active} />
            </TableCell>
            <TableCell className="w-[16%] whitespace-normal">
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
