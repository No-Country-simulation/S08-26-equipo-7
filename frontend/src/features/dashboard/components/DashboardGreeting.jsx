import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import CreateTicketDialog from "@/features/tickets/components/CreateTicketDialog";

export default function DashboardGreeting() {
  const { user } = useAuth();
  return (
    <div className="p-4 bg-card rounded-lg my-4 flex-wrap sm:flex justify-between border border-border shadow-md">
      <div className="mb-4 sm:mb-0">
        <h1 className="text-2xl font-bold">¡Hola, {user.nombre}! Bienvenido a ServiceFlow</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Panorama operativo de solicitudes internas y cumplimiento corporativo de SLA.</p>
      </div>
      <div className="mt-4 lg:mt-2 xl:mt-0">
        <CreateTicketDialog
          trigger={
            <Button className="btn-gradient-primary h-8! w-auto cursor-pointer rounded-md! p-1! sm:h-9! sm:px-3! md:h-10! md:px-6!">
              <Plus />
              Nueva Solicitud
            </Button>
          }
        />
      </div>
    </div>
  );
}