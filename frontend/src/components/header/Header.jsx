import ThemeToggle from "@/components/ThemeToggle";
import SearchApp from "./SearchApp";
import CreateRequestDialog from "./CreateRequestDialog";
import NotificationPopover from "./NotificationPopover";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header(){
  return(
    <div className="flex h-16 w-full min-w-0 items-center justify-between gap-0 border-b bg-card/80 px-1 text-center md:h-20 md:gap-2 md:px-8 md:pr-4">
      <div className="flex min-w-0 flex-1 items-center gap-1 md:gap-2">
        <SidebarTrigger className="md:hidden" />
        <SearchApp />
      </div>
      <div className="flex shrink-0 items-center justify-end gap-0 md:min-w-75">
        <CreateRequestDialog />
        <div className="ml-1 flex gap-0 sm:ml-3">
          <NotificationPopover />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}