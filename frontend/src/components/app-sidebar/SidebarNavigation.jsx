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
      </SidebarMenu>
    </SidebarContent>
  );
}
