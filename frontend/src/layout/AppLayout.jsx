import { SidebarProvider } from "@/components/ui/sidebar";
import Header from '@/components/header/Header';
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/app-sidebar/AppSidebar";


export default function AppLayout(){

  return(
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-0 body-app">
      <SidebarProvider>
        <AppSidebar />
        <div className="min-w-0 w-full">
          <Header />
          <main>
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
      
    </div>
  );
}