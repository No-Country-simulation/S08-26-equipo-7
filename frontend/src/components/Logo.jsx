import { LayoutDashboard } from "lucide-react";

export default function Logo() {
  return (<div className="flex flex-col items-center">
    <div className="h-14 w-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/10 transform rotate-3">
      <LayoutDashboard className="w-7 h-7 text-white" />
    </div>
    <h1 className="text-3xl font-extrabold tracking-tight text-slate-700 dark:text-slate-200 mt-4">
            ServiceFlow
    </h1>
  </div>);
}

