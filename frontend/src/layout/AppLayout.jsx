import { Outlet } from "react-router-dom";

import AppSidebar from "@/components/app-sidebar/AppSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import NotificationPopover from "@/features/notifications/components/NotificationPopover";
import CreateRequestDialog from "@/features/tickets/components/dialogs/CreateDialog";

export default function AppLayout() {
  return (
    <div className="body-app relative flex min-h-screen w-full flex-col items-center justify-center p-0">
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full min-w-0">
          <header className="bg-card/80 flex h-16 w-full min-w-0 items-center justify-between gap-0 border-b px-1 text-center md:h-20 md:gap-2 md:px-8 md:pr-4">
            <div className="flex min-w-0 flex-1 items-center gap-1 md:gap-2">
              <SidebarTrigger className="md:hidden" />
            </div>
            <div className="flex shrink-0 items-center justify-end gap-0 md:min-w-75">
              <CreateRequestDialog />
              <div className="ml-1 flex gap-0 sm:ml-3">
                <NotificationPopover />
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main>
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
