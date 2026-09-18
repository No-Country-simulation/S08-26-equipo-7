import DashboardGreeting from "@/features/dashboard/components/DashboardGreeting";
import DashboardStats from "@/features/dashboard/components/DashboardStats";
import RecentTicketsTable from "@/features/dashboard/components/RecentTicketsTable";

export default function DashboardPage() {
  return (
    <div className="mx-auto w-4/5 space-y-4">
      <DashboardGreeting />
      <DashboardStats />
      <RecentTicketsTable />
    </div>
  );
}
