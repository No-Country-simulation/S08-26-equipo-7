import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUserAvatarStyle, getUserInitials } from "@/lib/userAvatar";

export default function UserAvatar({ name }) {
  return (
    <Avatar
      aria-hidden="true"
      className="bg-[hsl(var(--user-avatar-hue)_72%_94%)] text-[hsl(var(--user-avatar-hue)_70%_34%)] dark:bg-[hsl(var(--user-avatar-hue)_45%_24%)] dark:text-[hsl(var(--user-avatar-hue)_85%_82%)] size-10 font-semibold"
      style={getUserAvatarStyle(name)}
    >
      <AvatarFallback className="bg-transparent text-inherit">
        {getUserInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
