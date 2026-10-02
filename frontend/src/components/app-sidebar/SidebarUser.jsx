import { Loader2, LogOut, UserRound } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import UserAvatar from "@/features/users/components/UserAvatar";
import { getRoleLabel } from "@/i18n/es/roles";

import ProfileDialog from "./ProfileDialog";

export default function SidebarUser() {
  const { user, logoutContext, logoutLoading } = useAuth();
  const { state } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const isCollapsed = state === "collapsed";
  const name = user?.nombre ?? "Usuario";
  const email = user?.email ?? user?.correo ?? "";

  async function handleLogout() {
    if (logoutLoading) return;
    await logoutContext();
  }

  function openProfile() {
    setMenuOpen(false);
    setProfileOpen(true);
  }

  return (
    <>
      <SidebarFooter className="shrink-0 border-t p-2">
        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className={`relative h-auto w-full justify-start gap-3 rounded-lg p-2 text-left hover:scale-100 ${isCollapsed ? "h-8 w-8 justify-center p-0" : ""}`}
              aria-label={`Abrir menú de ${name}`}
              aria-busy={logoutLoading}
              disabled={logoutLoading}
            >
              <span className="relative inline-flex shrink-0">
                <UserAvatar name={name} className={isCollapsed ? "size-8" : undefined} />
                <span
                  aria-label="Estado: activo"
                  className="border-sidebar absolute right-0 bottom-0 size-3 rounded-full border-2 bg-success"
                />
              </span>
              {!isCollapsed && (
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-semibold">
                    {name}
                  </span>
                  <span className="text-muted-foreground block truncate text-xs">
                    {getRoleLabel(user?.rol)}
                  </span>
                </span>
              )}
              {logoutLoading && (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side={isCollapsed ? "right" : "top"}
            align={isCollapsed ? "end" : "start"}
            sideOffset={8}
            className="w-[min(18rem,calc(100vw-2rem))] gap-0 overflow-hidden p-0"
          >
            <div className="border-b px-4 py-3">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="text-muted-foreground truncate text-xs">{email}</p>
            </div>
            <div className="p-1.5">
              <Button
                type="button"
                variant="ghost"
                className="h-10 w-full justify-start gap-3 rounded-md px-2.5 hover:scale-100"
                onClick={openProfile}
              >
                <UserRound className="text-muted-foreground size-4" aria-hidden="true" />
                Configurar mi perfil
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-10 w-full justify-start gap-3 rounded-md px-2.5 text-destructive hover:scale-100 hover:bg-destructive/10 hover:text-destructive"
                onClick={handleLogout}
                disabled={logoutLoading}
              >
                {logoutLoading ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <LogOut className="size-4" aria-hidden="true" />
                )}
                {logoutLoading ? "Cerrando sesión…" : "Cerrar sesión"}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} user={user} />
    </>
  );
}
