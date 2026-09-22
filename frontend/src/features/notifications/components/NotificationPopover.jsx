import { Bell } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getNotifications } from "@/features/notifications/services/notificationApi";
import { usePolling } from "@/hooks/usePolling";
import { formatTicketDate } from "@/lib/utils";

const NOTIFICATIONS_POLL_INTERVAL = 30_000;

export default function NotificationPopover() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { error } = usePolling({
    fetchData: getNotifications,
    onSuccess: (data) => {
      setNotifications(data.items ?? []);
      setUnreadCount(data.unread ?? 0);
    },
    interval: NOTIFICATIONS_POLL_INTERVAL,
    showInitialLoading: false,
  });

  return (
    <Tooltip open={isPopoverOpen ? false : undefined}>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-2xl"
                aria-label="Notificaciones"
                className="text-muted-foreground hover:bg-muted hover:text-foreground relative size-8 cursor-pointer rounded-md border-0 bg-transparent sm:size-10 [&_svg]:size-5 md:[&_svg]:size-6"
              >
                <span className="relative inline-flex size-5 items-center justify-center md:size-6">
                  <Bell className="size-5 md:size-6" />
                  {unreadCount > 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute -top-1 -right-1 size-2 animate-pulse rounded-full bg-destructive md:-top-0.5 md:-right-0.5"
                    />
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 mr-10">
              {error && notifications.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No se pudieron cargar las notificaciones.
                </p>
              ) : notifications.length > 0 ? (
                <div className="max-h-126">
                  <div className="flex justify-between py-2 border-b border-border">
                    <div>{unreadCount} Notificaciones sin leer</div>
                    <div className="text-primary cursor-pointer hover:underline text-xs">Marcar como leidas</div>
                  </div>
                  <ScrollArea className="h-120 w-80 pr-5 pb-5">
                    {notifications.map((notification) => (
                      <Link key={notification.id} to={`/tickets/${notification.ticketId}`}>
                        <div className={notification.leida ? "" : "bg-ring border border-border rounded-lg p-2 my-1"}>
                          <div className="text-xs font-semibold flex justify-between">
                            <div>{notification.tipo.replace(/[-_]/g, " ")}</div>
                            <div>{formatTicketDate(notification.creadoEn)}</div>
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {notification.mensaje}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </ScrollArea>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No tienes notificaciones.
                </p>
              )}
            </PopoverContent>
          </Popover>
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">Notificaciones</TooltipContent>
    </Tooltip>
  );
}