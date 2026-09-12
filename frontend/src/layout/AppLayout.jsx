import { SidebarProvider } from "@/components/ui/sidebar";
import Header from '@/components/header/Header';
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/app-sidebar/AppSidebar";


export default function AppLayout(){

  return(
    <div className="relative flex flex-col items-center justify-center w-screen h-screen px-4 md:px-0 body-app">
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full">
          <Header />
          <main>
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
      
    </div>
  );
}