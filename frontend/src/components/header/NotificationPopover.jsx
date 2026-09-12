import { Bell } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function NotificationPopover(){
  return(
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button"
          variant="ghost"
          size="icon-2xl"
          className="bg-card rounded-full flex-items justify-center border border-border cursor-pointer"
        >
          <Bell />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
      </PopoverContent>
    </Popover>
  );
};