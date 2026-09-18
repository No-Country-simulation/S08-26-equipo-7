import { Outlet } from "react-router-dom";

import AppSidebar from "@/components/app-sidebar/AppSidebar";
import Header from "@/components/header/Header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout() {
  return (
    <div className="body-app relative flex min-h-screen w-full flex-col items-center justify-center p-0">
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full min-w-0">
          <Header />
          <main>
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
