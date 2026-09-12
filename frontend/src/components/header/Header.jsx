import ThemeToggle from "@/components/ThemeToggle";
import SearchApp from "./SearchApp";
import CreateRequestDialog from "./CreateRequestDialog";
import NotificationPopover from "./NotificationPopover";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header(){
  return(
    <div className="flex h-16 w-full min-w-0 items-center justify-between gap-2 border-b bg-card/80 px-3 text-center md:h-20 md:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <SearchApp />
      </div>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2 sm:min-w-75">
        <CreateRequestDialog />
        <div className="flex gap-1 sm:gap-2">
          <NotificationPopover />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}