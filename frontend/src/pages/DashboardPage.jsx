import DashboardGreeting from "@/features/dashboard/DashboardGreeting";
import DashboardStats from "@/features/dashboard/DashboardStats";
import RecentTicketsTable from "@/features/dashboard/RecentTicketsTable";

export default function DashboardPage() {
  return (
    <div className="space-y-4 w-4/5 mx-auto">
      <DashboardGreeting />
      <DashboardStats />
      <RecentTicketsTable />
    </div>
  );
}