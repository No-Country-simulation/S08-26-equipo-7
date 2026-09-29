import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import ModalDepartmens from "@/features/departments/components/ModalDepartmens";
import TableDepartmens from "@/features/departments/components/TableDepartmens";
import ToggleDepartmensDialog from "@/features/departments/components/ToggleDepartmensDialog";
import DepartmensProvider, {
  useDepartmens,
} from "@/features/departments/context/DepartmensProvider";

function DepartmentsHeader() {
  const { openCreate, isLoading } = useDepartmens();

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
      <Button
        className="btn-gradient-primary w-full sm:w-auto"
        onClick={openCreate}
        disabled={isLoading}
      >
        <Plus />
        Agregar departamento
      </Button>
    </div>
  );
}

export default function Departments() {
  return (
    <DepartmensProvider>
      <DepartmentsHeader />
      <TableDepartmens />
      <ModalDepartmens />
      <ToggleDepartmensDialog />
    </DepartmensProvider>
  );
}
