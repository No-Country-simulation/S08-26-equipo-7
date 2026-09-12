import { NavLink } from "react-router-dom";
import {
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

export default function SidebarMenuItemLink({
  icon: Icon,
  label,
  to,
  onClick,
  isActive = false,
}) {
  const { state, setOpen } = useSidebar();
  const Component = to ? NavLink : "button";

  function handleClick(event) {
    if (state === "collapsed") {
      setOpen(true);
    }

    onClick?.(event);
  }

  return (
    <SidebarMenuButton
      asChild
      isActive={to ? isActive : false}
      tooltip={label}
    >
      <Component
        {...(to ? { to } : { type: "button" })}
        onClick={handleClick}
        aria-label={label}
      >
        <span className="absolute top-1/2 left-0 flex h-10 w-10 -translate-y-1/2 items-center justify-center">
          <Icon />
        </span>
        <span
          aria-hidden="true"
          className="h-5 w-6 shrink-0 group-data-[collapsible=icon]:hidden"
        />
        <span className="whitespace-nowrap text-xs min-[360px]:text-sm sm:text-sm group-data-[collapsible=icon]:hidden">
          {label}
        </span>
      </Component>
    </SidebarMenuButton>
  );
}
