import {
  BookOpen,
  FolderKanban,
  House,
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
    adminOnly: true,
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
    adminOnly: true,
  },
  {
    label: "Departamentos",
    href: "/departments",
    icon: FolderKanban,
    adminOnly: true,
  },
];

export default function SidebarNavigation() {
  const { isAdmin, isOperationalUser } = useAuth();
  const location = useLocation();
  const visibleItems = navigationItems.filter((item) =>
    item.adminOnly ? isAdmin : isAdmin || isOperationalUser,
  );

  return (
    <SidebarContent>
      <SidebarMenu>
        {visibleItems.map((item) => {
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
      </SidebarMenu>
    </SidebarContent>
  );
}
