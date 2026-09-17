import { traslatePriority } from "@/i18n/es/priority";
export default function PriorityBadge({ priority }) {
  const styles = {
    LOW: "text-muted-foreground bg-muted-foreground/10 border-muted-foreground/20",
    MEDIUM: "text-primary bg-primary/10 border-primary/20",
    HIGH: "text-warning bg-warning/10 border-warning/20",
    URGENT: "text-destructive bg-destructive/10 border-destructive/20",
  };

  return (
    <span className={`border p-1 mt-1 rounded-sm ${styles[priority]}`}>
      {traslatePriority(priority)}
    </span>
  );
};