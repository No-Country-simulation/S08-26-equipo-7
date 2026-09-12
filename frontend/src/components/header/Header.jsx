import ThemeToggle from "@/components/ThemeToggle";
import SearchApp from "./SearchApp";
import CreateRequestDialog from "./CreateRequestDialog";
import NotificationPopover from "./NotificationPopover";



export default function Header(){
  return(
    <div className="w-full bg-card/80 text-center h-20 border-b flex justify-between items-center px-8">
      <SearchApp />
      <div className="flex space-x-2 sm:min-w-75">
        <CreateRequestDialog />
        <div className="space-x-2 flex">
          <NotificationPopover />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}