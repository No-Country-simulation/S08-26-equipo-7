import { LayoutDashboard } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-14 w-14 rotate-3 transform items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/10">
        <LayoutDashboard className="h-7 w-7 text-white" />
      </div>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-700 dark:text-slate-200">
        ServiceFlow
      </h1>
    </div>
  );
}
