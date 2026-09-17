import { useSlaCountdown } from "@/features/tickets/hooks/useSlaCountdown";

export default function Remaining({ slaDueAt, status }) {
  const isResolved = status === "RESOLVED" || status === "CLOSED";
  const { timeLeft, isExpired, difference } = useSlaCountdown(slaDueAt);
  const isWarning = 12 * 60 * 60 * 1000;

  if (isResolved) {
    return <span className="text-success">Resuelto</span>;
  }

  return (
    <span className={isExpired ? "text-destructive" : difference < isWarning ? "text-warning" : "text-muted-foreground"}>
      {isExpired ? `Vencido (${timeLeft})` : difference < isWarning ? `Por vencer (${timeLeft})` : timeLeft}
    </span>
  );
}
