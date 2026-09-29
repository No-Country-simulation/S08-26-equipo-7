import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

import { getDepartments } from "@/features/departments/service/departmensApi";
import {
  changeUserPassword,
  createUser,
  getUsers,
  updateUser,
} from "@/features/users/service/usersApi";
import { generateTemporaryPassword } from "@/lib/userSecurity";

const UsersContext = createContext(null);
const TOAST_CLASS = "bg-foreground! dark:bg-background! text-white!";

export default function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [departmentError, setDepartmentError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [passwordTarget, setPasswordTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const loadData = useCallback(async (shouldApply = () => true) => {
    const [usersResult, departmentsResult] = await Promise.allSettled([
      getUsers(),
      getDepartments(),
    ]);
    if (!shouldApply()) return;

    setLoadError(null);
    if (usersResult.status === "fulfilled") {
      setUsers(Array.isArray(usersResult.value) ? usersResult.value : []);
    } else {
      setLoadError(usersResult.reason?.message || "Error al cargar usuarios.");
    }

    if (departmentsResult.status === "fulfilled") {
      setDepartments(
        Array.isArray(departmentsResult.value) ? departmentsResult.value : [],
      );
      setDepartmentError(null);
    } else {
      setDepartments([]);
      setDepartmentError(departmentsResult.reason?.message || "No se pudieron cargar las áreas.");
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isCurrent = true;
    Promise.resolve().then(() => {
      if (isCurrent) loadData(() => isCurrent);
    });
    return () => {
      isCurrent = false;
    };
  }, [loadData]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setLoadError(null);
    loadData();
  }, [loadData]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        `${user.name ?? ""} ${user.email ?? ""}`
          .toLocaleLowerCase()
          .includes(normalizedSearch);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesArea =
        areaFilter === "all" ||
        (user.area ?? "").toLocaleLowerCase() === areaFilter.toLocaleLowerCase();

      return matchesSearch && matchesRole && matchesArea;
    });
  }, [areaFilter, roleFilter, search, users]);

  const summary = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((user) => user.role === "ADMIN").length,
      agents: users.filter((user) => user.role === "AGENT").length,
      supervisors: users.filter((user) => user.role === "SUPERVISOR").length,
      requesters: users.filter((user) => user.role === "REQUESTER").length,
    }),
    [users],
  );

  const openCreateDialog = useCallback(() => {
    setSelectedUser(null);
    setCreatedCredentials(null);
    setDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((user) => {
    setSelectedUser(user);
    setCreatedCredentials(null);
    setDialogOpen(true);
  }, []);

  const closeUserDialog = useCallback(() => {
    if (isSaving) return;
    setDialogOpen(false);
    setSelectedUser(null);
    setCreatedCredentials(null);
  }, [isSaving]);

  const saveUser = useCallback(
    async (values) => {
      setIsSaving(true);
      try {
        if (selectedUser) {
          const payload = {
            name: values.name,
            role: values.role,
            area: values.area || null,
          };
          const updated = await updateUser(selectedUser.id, payload);
          setUsers((current) =>
            current.map((user) =>
              user.id === selectedUser.id ? { ...user, ...payload, ...updated } : user,
            ),
          );
          toast.success("Usuario actualizado", {
            description: `${values.name} se guardó correctamente.`,
            className: TOAST_CLASS,
          });
          setDialogOpen(false);
          setSelectedUser(null);
          return { ok: true };
        }

        const password = generateTemporaryPassword();
        const created = await createUser({ ...values, password });
        setUsers((current) => [created, ...current]);
        setCreatedCredentials({ name: created.name, email: created.email, password });
        toast.success("Usuario creado", {
          description: "La contraseña temporal está lista para compartir.",
          className: TOAST_CLASS,
        });
        return { ok: true };
      } catch (error) {
        toast.error(selectedUser ? "No se pudo actualizar el usuario" : "No se pudo crear el usuario", {
          description: error.message,
          className: TOAST_CLASS,
        });
        return { ok: false, error };
      } finally {
        setIsSaving(false);
      }
    },
    [selectedUser],
  );

  const requestPasswordChange = useCallback((user) => {
    setPasswordTarget(user);
  }, []);

  const closePasswordDialog = useCallback(() => {
    if (!isChangingPassword) setPasswordTarget(null);
  }, [isChangingPassword]);

  const confirmPasswordChange = useCallback(async () => {
    if (!passwordTarget) return { ok: false };
    setIsChangingPassword(true);
    try {
      const password = generateTemporaryPassword();
      await changeUserPassword(passwordTarget.id, password);
      setPasswordTarget((current) => ({ ...current, generatedPassword: password }));
      toast.success("Contraseña renovada", {
        description: "Comparte la nueva contraseña temporal de forma segura.",
        className: TOAST_CLASS,
      });
      return { ok: true };
    } catch (error) {
      toast.error("No se pudo renovar la contraseña", {
        description: error.message,
        className: TOAST_CLASS,
      });
      return { ok: false, error };
    } finally {
      setIsChangingPassword(false);
    }
  }, [passwordTarget]);

  const value = useMemo(
    () => ({
      users,
      departments,
      departmentError,
      isLoading,
      loadError,
      refresh,
      search,
      setSearch,
      roleFilter,
      setRoleFilter,
      areaFilter,
      setAreaFilter,
      filteredUsers,
      summary,
      dialogOpen,
      selectedUser,
      createdCredentials,
      openCreateDialog,
      openEditDialog,
      closeUserDialog,
      saveUser,
      isSaving,
      passwordTarget,
      requestPasswordChange,
      closePasswordDialog,
      confirmPasswordChange,
      isChangingPassword,
    }),
    [
      areaFilter,
      closePasswordDialog,
      closeUserDialog,
      confirmPasswordChange,
      createdCredentials,
      departmentError,
      departments,
      dialogOpen,
      filteredUsers,
      isChangingPassword,
      isLoading,
      isSaving,
      loadError,
      openCreateDialog,
      openEditDialog,
      passwordTarget,
      requestPasswordChange,
      roleFilter,
      refresh,
      saveUser,
      selectedUser,
      search,
      setAreaFilter,
      setRoleFilter,
      setSearch,
      summary,
      users,
    ],
  );

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUsers() {
  const context = useContext(UsersContext);
  if (!context) throw new Error("useUsers debe usarse dentro de UsersProvider");
  return context;
}
