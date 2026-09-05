import { LayoutDashboard } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center mb-8 space-y-2">
        <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-zinc-900/20">
          <LayoutDashboard className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-700 mt-4">
            ServiceFlow
        </h1>
      </div>
      { children }
    </div>
  );
}