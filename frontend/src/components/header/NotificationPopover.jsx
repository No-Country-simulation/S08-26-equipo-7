import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NotificationPopover({ hasNotifications = true }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-2xl"
                aria-label="Notificaciones"
                className="relative size-8 cursor-pointer rounded-md border-0 bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground [&_svg]:size-5 sm:size-10 md:[&_svg]:size-6"
              >
                <span className="relative inline-flex size-5 items-center justify-center md:size-6">
                  <Bell className="size-5 md:size-6" />
                  {hasNotifications && (
                    <span
                      aria-hidden="true"
                      className="absolute -top-1 -right-1 size-2 rounded-full bg-rose-500 animate-pulse md:-top-0.5 md:-right-0.5"
                    />
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" />
          </Popover>
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">Notificaciones</TooltipContent>
    </Tooltip>
  );
}
