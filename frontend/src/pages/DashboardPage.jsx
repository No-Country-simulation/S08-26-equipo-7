import DashboardGreeting from "@/features/dashboard/components/DashboardGreeting";
import DashboardStats from "@/features/dashboard/components/DashboardStats";

export default function DashboardPage() {
  return (
    <div className="space-y-4 w-4/5 mx-auto">
      <DashboardGreeting />
      <DashboardStats />
    </div>
  );
}