import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUserAvatarStyle, getUserInitials } from "@/lib/userAvatar";
import { cn } from "@/lib/utils";

export default function UserAvatar({ name, className }) {
  return (
    <Avatar
      aria-hidden="true"
      className={cn(
        "size-10 bg-[hsl(var(--user-avatar-hue)_72%_94%)] font-semibold text-[hsl(var(--user-avatar-hue)_70%_34%)] dark:bg-[hsl(var(--user-avatar-hue)_45%_24%)] dark:text-[hsl(var(--user-avatar-hue)_85%_82%)]",
        className,
      )}
      style={getUserAvatarStyle(name)}
    >
      <AvatarFallback className="bg-transparent text-inherit">
        {getUserInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
