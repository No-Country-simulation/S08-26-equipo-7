import { translatePriority } from "@/i18n/es/priority";
import { cn } from "@/lib/utils";

export default function PriorityBadge({ priority, className }) {
  const styles = {
    LOW: "text-muted-foreground bg-muted-foreground/10 border-muted-foreground/20",
    MEDIUM: "text-primary bg-primary/10 border-primary/20",
    HIGH: "text-warning bg-warning/10 border-warning/20",
    URGENT: "text-destructive bg-destructive/10 border-destructive/20",
  };

  return (
    <span className={cn("rounded-sm border p-1", styles[priority], className)}>
      {translatePriority(priority)}
    </span>
  );
}
