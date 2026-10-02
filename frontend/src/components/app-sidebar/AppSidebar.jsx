import { LayoutDashboard } from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import SidebarNavigation from "./SidebarNavigation";
import SidebarUser from "./SidebarUser";

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
            className="focus-visible:ring-ring absolute top-1/2 left-1 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md p-0 text-left transition-none outline-none focus-visible:ring-2"
          >
            <div className="flex h-8 w-8 shrink-0 rotate-3 transform items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20 min-[360px]:h-9 min-[360px]:w-9 min-[360px]:rounded-xl sm:h-10 sm:w-10 dark:shadow-cyan-500/10">
              <LayoutDashboard className="h-5 w-5 text-white min-[360px]:h-6 min-[360px]:w-6 sm:h-7 sm:w-7" />
            </div>
          </button>
          <span className="absolute top-1/2 left-14 -translate-y-1/2 text-sm font-extrabold tracking-tight whitespace-nowrap text-slate-700 group-data-[collapsible=icon]:hidden min-[360px]:text-base sm:text-2xl dark:text-slate-200">
            ServiceFlow
          </span>
          <SidebarTrigger className="absolute top-1/2 right-2 -translate-y-1/2! transition-none! group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>
      <div className="border-border h-13.25 shrink-0 border-t py-4 text-center text-sm font-bold opacity-100 transition-opacity delay-100 duration-150 ease-linear group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:delay-0 group-data-[collapsible=icon]:duration-0">
        MENÚ PRINCIPAL
      </div>
      <SidebarNavigation />
      <SidebarUser />
    </Sidebar>
  );
}
