import { useLocation } from "react-router-dom";
import { ChartNoAxesCombined, LogOut } from "lucide-react";
import SidebarMenuItemLink from "./SidebarMenuItemLink";
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth/hooks/useAuth";

const navigationItems = [
  {
    label: "Resumen",
    href: "/dashboard",
    icon: ChartNoAxesCombined,
  },
];

export default function SidebarNavigation() {
  const { logoutContext } = useAuth();
  const location = useLocation();

  return (
    <SidebarContent>
      <SidebarMenu>
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuItemLink
                icon={Icon}
                label={item.label}
                to={item.href}
                isActive={location.pathname === item.href}
              />
            </SidebarMenuItem>
          );
        })}
        <SidebarMenuItem>
          <SidebarMenuItemLink
            icon={LogOut}
            label="Cerrar sesión"
            onClick={logoutContext}
          />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>
  );
}