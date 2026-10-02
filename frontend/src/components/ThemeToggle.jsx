import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const label = isDark ? "Activar modo claro" : "Activar modo oscuro";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-2xl"
      onClick={toggleTheme}
      aria-label={label}
      className="text-muted-foreground hover:bg-muted hover:text-foreground size-8 cursor-pointer rounded-md border-0 bg-transparent sm:size-10 [&_svg]:size-5 md:[&_svg]:size-6"
    >
      {isDark ? (
        <Sun className="size-5 md:size-6!" />
      ) : (
        <Moon className="size-5 md:size-6!" />
      )}
    </Button>
  );
}
