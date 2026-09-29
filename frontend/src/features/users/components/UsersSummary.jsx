import { Headset, Shield, ShieldCheck, UserRound, UsersRound } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useUsers } from "@/features/users/context/UsersContext";

const SUMMARY_CARDS = [
  { key: "total", label: "Total usuarios", icon: UsersRound, tone: "blue" },
  { key: "admins", label: "Administradores", icon: ShieldCheck, tone: "violet" },
  { key: "supervisors", label: "Supervisores", icon: Shield, tone: "indigo" },
  { key: "agents", label: "Agentes", icon: Headset, tone: "sky" },
  { key: "requesters", label: "Solicitantes", icon: UserRound, tone: "slate" },
];

const TONE_CLASSES = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300",
  indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300",
  sky: "bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-300",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export default function UsersSummary() {
  const { summary, isLoading } = useUsers();

  return (
    <section aria-label="Resumen de usuarios" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {SUMMARY_CARDS.map(({ key, label, icon: Icon, tone }) => (
        <article key={key} className="bg-card border-border flex min-h-24 items-center justify-between rounded-xl border p-5 shadow-sm">
          <div>
            <h2 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">{label}</h2>
            {isLoading ? (
              <Skeleton className="mt-2 h-7 w-12" />
            ) : (
              <p className="mt-1 text-2xl leading-none font-bold tabular-nums" aria-live="polite">
                {summary[key]}
              </p>
            )}
          </div>
          <span className={`flex size-11 items-center justify-center rounded-xl ${TONE_CLASSES[tone]}`}>
            <Icon aria-hidden="true" className="size-5" />
          </span>
        </article>
      ))}
    </section>
  );
}
