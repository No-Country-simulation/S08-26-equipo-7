import { Bell } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getNotifications } from "@/features/notifications/services/notificationApi";
import { usePolling } from "@/hooks/usePolling";

const NOTIFICATIONS_POLL_INTERVAL = 30_000;

export default function NotificationPopover() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

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
                className="text-muted-foreground hover:bg-muted hover:text-foreground relative size-8 cursor-pointer rounded-md border-0 bg-transparent sm:size-10 [&_svg]:size-5 md:[&_svg]:size-6"
              >
                <span className="relative inline-flex size-5 items-center justify-center md:size-6">
                  <Bell className="size-5 md:size-6" />
                  {unreadCount > 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute -top-1 -right-1 size-2 animate-pulse rounded-full bg-rose-500 md:-top-0.5 md:-right-0.5"
                    />
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              {error && notifications.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No se pudieron cargar las notificaciones.
                </p>
              ) : notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <p key={notification.id} className="text-sm">
                      {notification.mensaje}
                    </p>
                  ))}
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
