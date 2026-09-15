import { useAuth } from "@/features/auth/hooks/useAuth";

export default function DashboardGreeting() {
  const { user } = useAuth();
  return (
    <div className="p-4 bg-card rounded-lg my-4 flex border border-border shadow-md">
      <div className="mb-4 sm:mb-0">
        <h1 className="text-2xl font-bold">¡Hola, {user.nombre}! Bienvenido a ServiceFlow</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Panorama operativo de solicitudes internas y cumplimiento corporativo de SLA.</p>
      </div>
    </div>
  );
}