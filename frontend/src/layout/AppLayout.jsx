import { Sidebar, SidebarHeader, SidebarProvider, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import Header from '@/components/Header';
import { LayoutDashboard, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AppLayout({ children }){

  return(
    <div className="relative flex flex-col items-center justify-center w-screen h-screen px-4 md:px-0 body-app">
      <SidebarProvider>
        <Sidebar>
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
          <SidebarContent>
            { children }
          </SidebarContent>
          <SidebarFooter className="border-t">
            <div className="flex space-x-2 items-center">
              <Avatar size="lg">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <div>Juan Camilo Gracia</div>
                <p className="text-muted-foreground">Administrador</p>
              </div>
              <div className="mx-auto">
                <LogOut />
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <Header />
      </SidebarProvider>
      
    </div>
  );
}