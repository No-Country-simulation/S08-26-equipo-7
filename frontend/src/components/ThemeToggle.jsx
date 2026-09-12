import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const label = isDark ? "Activar modo claro" : "Activar modo oscuro";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-2xl"
          onClick={toggleTheme}
          aria-label={label}
          className="size-8 cursor-pointer rounded-md border-0 bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground [&_svg]:size-5 sm:size-10 md:[&_svg]:size-6"
        >
          {isDark ? (
            <Sun className="size-5 md:!size-6" />
          ) : (
            <Moon className="size-5 md:!size-6" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}