import { translateStatus } from "@/i18n/es/status";
import { cn } from "@/lib/utils";

export default function StatusBadge({ status, className }) {
  const styles = {
    PENDIENTE:
      "text-muted-foreground bg-muted-foreground/10 border-muted-foreground/20",
    EN_PROCESO: "text-primary bg-primary/10 border-primary/20",
    EN_APROBACION: "text-warning bg-warning/10 border-warning/20",
    EXPIRADO: "text-destructive bg-destructive/10 border-destructive/20",
    RESUELTO: "text-success bg-success/10 border-success/20",
  };
  const fallbackStyle =
    "text-muted-foreground bg-muted-foreground/10 border-muted-foreground/20";
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-1 text-xs font-medium sm:text-sm",
        styles[status] ?? fallbackStyle,
        className,
      )}
    >
      {translateStatus(status)}
    </span>
  );
}
