import {
  BookOpen,
  FolderKanban,
  House,
  LogOut,
  SquareCheckBig,
  Ticket,
  Users,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth/hooks/useAuth";

import SidebarMenuItemLink from "./SidebarMenuItemLink";

const navigationItems = [
  {
    label: "Resumen",
    href: "/dashboard",
    icon: House,
  },
  {
    label: "Solicitudes",
    href: "/tickets",
    icon: Ticket,
  },
  {
    label: "Aprobaciones",
    href: "/approvals",
    icon: SquareCheckBig,
  },
  {
    label: "Base de Conocimiento",
    href: "/knowledge",
    icon: BookOpen,
  },
  {
    label: "Usuarios",
    href: "/users",
    icon: Users,
  },
  {
    label: "Departamentos",
    href: "/departments",
    icon: FolderKanban,
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
