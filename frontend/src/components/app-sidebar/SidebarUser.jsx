import { SidebarFooter } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getRoleLabel } from "@/i18n/es/roles";

export default function SidebarUser(){
  const { user } = useAuth();
  return (
    <SidebarFooter className="relative h-14 shrink-0 overflow-hidden border-t">
      <div className="absolute top-1/2 left-2 flex h-8 w-8 -translate-y-1/2 justify-center">
        <Avatar size="default">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="ml-10 group-data-[collapsible=icon]:hidden">
        <div>{user.nombre}</div>
        <p className="text-muted-foreground">{getRoleLabel(user.rol)}</p>
      </div>
    </SidebarFooter>
  );
};