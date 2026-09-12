import { SidebarFooter } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getRoleLabel } from "@/i18n/es/roles";

export default function SidebarUser(){
  const { user, logoutContext } = useAuth();
  return(
    <SidebarFooter className="border-t">
      <div className="flex space-x-2 items-center">
        <Avatar size="lg">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <div>{ user.nombre }</div>
          <p className="text-muted-foreground">{getRoleLabel(user.rol)}</p>
        </div>
        <div className="mx-auto">
          <Button variant="ghost" onClick={logoutContext} className="cursor-pointer">
            <LogOut />
          </Button>
        </div>
      </div>
    </SidebarFooter>);
};