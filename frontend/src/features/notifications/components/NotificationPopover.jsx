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
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/features/notifications/services/notificationApi";
import { usePolling } from "@/hooks/usePolling";
import { formatTicketDate } from "@/lib/utils";

const NOTIFICATIONS_POLL_INTERVAL = 30_000;

export default function NotificationPopover() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { error, refresh } = usePolling({
    fetchData: getNotifications,
    onSuccess: (data) => {
      setNotifications(data.items ?? []);
      setUnreadCount(data.unread ?? 0);
    },
    interval: NOTIFICATIONS_POLL_INTERVAL,
    showInitialLoading: false,
  });

  const handleNotificationClick = async (notificationId, isRead) => {
    try {
      if (!isRead) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, leida: true } : n,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        await markNotificationAsRead(notificationId);
        refresh();
      }
    } catch (err) {
      console.error("Error al marcar la notificación como leída:", err);
      refresh();
    } finally {
      setIsPopoverOpen(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })));
      setUnreadCount(0);
      await markAllNotificationsAsRead();
      refresh();
    } catch (err) {
      console.error(
        "Error al marcar todas las notificaciones como leídas:",
        err,
      );
      refresh();
    }
  };

  return (
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
                className="bg-destructive absolute -top-1 -right-1 size-2 animate-pulse rounded-full md:-top-0.5 md:-right-0.5 text-primary"
              />
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mr-10 w-80">
        {error && notifications.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No se pudieron cargar las notificaciones.
          </p>
        ) : notifications.length > 0 ? (
          <div className="max-h-126">
            <div className="border-border flex justify-between items-center border-b py-2">
              <div>{unreadCount} Notificaciones sin leer</div>
              <Button
                className="text-primary cursor-pointer text-xs"
                variant="link"
                onClick={handleMarkAllAsRead}
              >
                Marcar como leidas
              </Button>
            </div>
            <ScrollArea className="h-120 w-80 pr-5 pb-5">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={`/tickets/${notification.ticketId}`}
                  onClick={() =>
                    handleNotificationClick(
                      notification.id,
                      notification.leida,
                    )
                  }
                >
                  <div
                    className={
                      notification.leida
                        ? "my-1 p-2"
                        : "bg-ring border-border my-1 rounded-lg border p-2"
                    }
                  >
                    <div className="flex justify-between text-xs font-semibold">
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
  );
}