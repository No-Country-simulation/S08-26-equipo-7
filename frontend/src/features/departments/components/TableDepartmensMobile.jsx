import { Fragment } from "react";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import ActionCellDepartmens from "@/features/departments/components/ActionCellDepartmens";
import {
  ApprovalBadge,
  StatusBadge,
} from "@/features/departments/components/DepartmentBadges";
import { useDepartmens } from "@/features/departments/context/DepartmensProvider";

function LabelCell({ children, last = false }) {
  return (
    <TableCell
      className={`bg-muted-foreground/5 text-muted-foreground w-1/3 text-xs font-bold whitespace-normal ${
        last ? "border-border border-b-4" : ""
      }`}
    >
      {children}
    </TableCell>
  );
}

function ValueCell({ children, last = false }) {
  return (
    <TableCell
      className={`w-2/3 min-w-0 whitespace-normal [overflow-wrap:anywhere] ${
        last ? "border-border border-b-4" : ""
      }`}
    >
      {children}
    </TableCell>
  );
}

export default function TableDepartmensMobile() {
  const { departments } = useDepartmens();

  return (
    <Table className="table-fixed">
      <TableBody className="border-border border">
        {departments.map((department) => (
          <Fragment key={department.id}>
            <TableRow>
              <LabelCell>CÓDIGO</LabelCell>
              <ValueCell>
                <span className="font-semibold tracking-wide">
                  {department.code}
                </span>
              </ValueCell>
            </TableRow>
            <TableRow>
              <LabelCell>NOMBRE</LabelCell>
              <ValueCell>
                <span className="font-semibold">{department.name}</span>
                {department.description ? (
                  <p className="text-muted-foreground mt-1 text-xs">
                    {department.description}
                  </p>
                ) : null}
              </ValueCell>
            </TableRow>
            <TableRow>
              <LabelCell>REQUIERE APROBACIÓN</LabelCell>
              <ValueCell>
                <ApprovalBadge requiresApproval={department.requiresApproval} />
              </ValueCell>
            </TableRow>
            <TableRow>
              <LabelCell>ESTADO</LabelCell>
              <ValueCell>
                <StatusBadge active={department.active} />
              </ValueCell>
            </TableRow>
            <TableRow>
              <LabelCell last>ACCIONES</LabelCell>
              <ValueCell last>
                <ActionCellDepartmens department={department} mobileView />
              </ValueCell>
            </TableRow>
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
