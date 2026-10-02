import InfoBanner from "@/components/InfoBanner";
import Departments from "@/features/departments/Departmens";
export default function DepartmentsPage() {
  return (
    <div className="mx-auto w-4/5 space-y-4">
      <InfoBanner
        title="Catálogo de Departamentos y Áreas"
        paragraph="Gestión de códigos de sistema, requisitos de aprobación obligatorios y demas aspectos relacionados."
      />
      <Departments />
    </div>
  );
}