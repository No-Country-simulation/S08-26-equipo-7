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
          className="size-8 cursor-pointer rounded-full border border-border bg-card sm:size-12 sm:max-md:size-10"
        >
          <Bell />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
      </PopoverContent>
    </Popover>
  );
};