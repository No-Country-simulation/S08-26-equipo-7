import { useSlaCountdown } from "@/components/SlaCountdown";

export default function SlaRemaining({ slaDueAt }) {
  const { timeLeft, isExpired, difference } = useSlaCountdown(slaDueAt);
  const isWarning = 12 * 60 * 60 * 1000;

  return (
    <span className={isExpired ? "text-destructive" : difference < isWarning ? "text-warning" : "text-muted-foreground"}>
      {isExpired ? `Vencido (${timeLeft})` : difference < isWarning ? `Por vencer (${timeLeft})` : timeLeft}
    </span>
  );
}
