import { Sidebar, SidebarHeader } from "@/components/ui/sidebar";
import { LayoutDashboard } from "lucide-react";
import SidebarUser from "./SidebarUser";
import SidebarNavigation from "./SidebarNavigation";


export default function AppSidebar() {

  return(<Sidebar>
    <SidebarHeader>
      <div className="flex items-center space-x-2 mx-auto my-4">
        <div className="h-10 w-10 bg-linear-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/10 transform rotate-3">
          <LayoutDashboard className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-700 dark:text-slate-200">
            ServiceFlow
        </h1>
      </div>
    </SidebarHeader>
    <SidebarNavigation />
    <SidebarUser />
  </Sidebar>
  )};