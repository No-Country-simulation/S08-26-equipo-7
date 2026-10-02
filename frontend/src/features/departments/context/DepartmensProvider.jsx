import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DepartmensContext } from "@/features/departments/context/departmensContext";
import {
  createDepartment,
  getDepartments,
  toggleDepartment,
  updateDepartment,
} from "@/features/departments/service/departmensApi";

async function loadDepartments() {
  const data = await getDepartments();
  return Array.isArray(data) ? data : [];
}

export default function DepartmensProvider({ children }) {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [toggleTarget, setToggleTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchDepartments() {
      try {
        const data = await loadDepartments();
        if (cancelled) return;
        setDepartments(data);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err.message);
        setDepartments([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchDepartments();

    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await loadDepartments();
      setDepartments(data);
    } catch (err) {
      setError(err.message);
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openCreate = useCallback(() => {
    setSelectedDepartment(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((department) => {
    setSelectedDepartment(department);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedDepartment(null);
  }, []);

  const requestToggle = useCallback((department) => {
    setToggleTarget(department);
  }, []);

  const closeToggle = useCallback(() => {
    if (isToggling) return;
    setToggleTarget(null);
  }, [isToggling]);

  const saveDepartment = useCallback(
    async (formValues) => {
      setIsSaving(true);

      try {
        if (selectedDepartment) {
          const updated = await updateDepartment(selectedDepartment.id, {
            name: formValues.name,
            description: formValues.description,
            requiresApproval: formValues.requiresApproval,
            active: selectedDepartment.active,
          });

          setDepartments((current) =>
            current.map((department) =>
              department.id === selectedDepartment.id
                ? { ...department, ...updated }
                : department,
            ),
          );

          toast.success("Departamento actualizado", {
            description: `${updated.name} se guardó correctamente.`,
            className: "bg-foreground! dark:bg-background! text-white!",
          });
        } else {
          const created = await createDepartment({
            code: formValues.code,
            name: formValues.name,
            description: formValues.description,
            requiresApproval: formValues.requiresApproval,
          });

          setDepartments((current) => [created, ...current]);

          toast.success("Departamento creado", {
            description: `${created.name} ya está disponible en el catálogo.`,
            className: "bg-foreground! dark:bg-background! text-white!",
          });
        }

        closeModal();
        return true;
      } catch (err) {
        toast.error("No se pudo guardar", {
          description: err.message,
          className: "bg-foreground! dark:bg-background! text-white!",
        });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [closeModal, selectedDepartment],
  );

  const confirmToggle = useCallback(async () => {
    if (!toggleTarget) return;

    setIsToggling(true);

    try {
      await toggleDepartment(toggleTarget.id);
      const nextActive = !toggleTarget.active;

      setDepartments((current) =>
        current.map((department) =>
          department.id === toggleTarget.id
            ? { ...department, active: nextActive }
            : department,
        ),
      );

      toast.success(
        nextActive ? "Departamento activado" : "Departamento desactivado",
        {
          description: nextActive
            ? `${toggleTarget.name} volverá a aparecer en las solicitudes.`
            : `${toggleTarget.name} ya no se ofrecerá al crear solicitudes.`,
          className: "bg-foreground! dark:bg-background! text-white!",
        },
      );

      setToggleTarget(null);
    } catch (err) {
      toast.error("No se pudo cambiar el estado", {
        description: err.message,
        className: "bg-foreground! dark:bg-background! text-white!",
      });
    } finally {
      setIsToggling(false);
    }
  }, [toggleTarget]);

  const value = useMemo(
    () => ({
      departments,
      isLoading,
      error,
      refresh,
      modalOpen,
      selectedDepartment,
      isEditing: Boolean(selectedDepartment),
      openCreate,
      openEdit,
      closeModal,
      saveDepartment,
      isSaving,
      toggleTarget,
      requestToggle,
      closeToggle,
      confirmToggle,
      isToggling,
    }),
    [
      closeModal,
      closeToggle,
      confirmToggle,
      departments,
      error,
      isLoading,
      isSaving,
      isToggling,
      modalOpen,
      openCreate,
      openEdit,
      refresh,
      requestToggle,
      saveDepartment,
      selectedDepartment,
      toggleTarget,
    ],
  );

  return (
    <DepartmensContext.Provider value={value}>
      {children}
    </DepartmensContext.Provider>
  );
}

// El hook se exporta junto al provider para que los consumidores no toquen el context.
// eslint-disable-next-line react-refresh/only-export-components
export function useDepartmens() {
  const context = useContext(DepartmensContext);

  if (!context) {
    throw new Error("useDepartmens debe usarse dentro de un DepartmensProvider");
  }

  return context;
}
