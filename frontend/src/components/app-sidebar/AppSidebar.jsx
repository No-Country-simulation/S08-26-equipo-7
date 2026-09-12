import {
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { LayoutDashboard } from "lucide-react";
import SidebarUser from "./SidebarUser";
import SidebarNavigation from "./SidebarNavigation";

export default function AppSidebar() {
  const { open, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="relative h-14 shrink-0 justify-center">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={open ? "Contraer menú lateral" : "Abrir menú lateral"}
            title={open ? "Contraer menú lateral" : "Abrir menú lateral"}
            onClick={toggleSidebar}
            className="absolute top-1/2 left-1 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md p-0 text-left outline-none transition-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="h-8 w-8 shrink-0 transform rotate-3 rounded-lg bg-linear-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/10 min-[360px]:h-9 min-[360px]:w-9 min-[360px]:rounded-xl sm:h-10 sm:w-10">
              <LayoutDashboard className="h-5 w-5 text-white min-[360px]:h-6 min-[360px]:w-6 sm:h-7 sm:w-7" />
            </div>
          </button>
          <h1 className="absolute top-1/2 left-14 -translate-y-1/2 whitespace-nowrap text-sm font-extrabold tracking-tight text-slate-700 dark:text-slate-200 min-[360px]:text-base sm:text-2xl group-data-[collapsible=icon]:hidden">
            ServiceFlow
          </h1>
          <SidebarTrigger className="absolute top-1/2 right-2 !-translate-y-1/2 !transition-none group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>
      <SidebarNavigation />
      <SidebarUser />
    </Sidebar>
  );
}