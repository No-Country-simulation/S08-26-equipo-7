import {
  Award,
  CircleCheck,
  Clock,
  OctagonAlert,
  Skull,
  Ticket,
  TrendingDown,
  TrendingUp,
  TrendingUpDown,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState } from "react";

import StatCard from "@/features/dashboard/components/StatCard";
import { getSummaryStats } from "@/features/tickets/services/statsSummaryApi";

export default function DashboardStats() {
  const [summaryStats, setSummaryStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [percentChange, setPercentChange] = useState(0);

  useEffect(() => {
    async function fetchSummaryStats() {
      try {
        const stats = await getSummaryStats();
        setSummaryStats(stats);
        setPercentChange(
          parseFloat(
            (
              ((stats?.activeTickets - stats?.activePrevMonth) /
                (stats?.activePrevMonth || 1)) *
              100
            ).toFixed(2),
          ),
        );
      } finally {
        setLoading(false);
      }
    }
    fetchSummaryStats();
  }, []);

  return (
    <div className="flex flex-wrap justify-between">
      <StatCard
        label="TICKETS ACTIVOS"
        value={summaryStats?.activeTickets}
        icon={<Ticket />}
        loading={loading}
        iconText={
          percentChange > 0 ? (
            <TrendingUp />
          ) : percentChange < 0 ? (
            <TrendingDown />
          ) : (
            <TrendingUpDown />
          )
        }
        text={`${percentChange}% vs mes anterior`}
        color={
          percentChange > 0
            ? "success"
            : percentChange < 0
              ? "destructive"
              : "neutro"
        }
      />
      <StatCard
        label="PRÓXIMOS A VENCER SLA"
        value={summaryStats?.nearSlaExpiry}
        icon={<Clock />}
        loading={loading}
        iconText={
          summaryStats?.nearSlaExpiry > 0 ? <TriangleAlert /> : <CircleCheck />
        }
        variant="warning"
        text="Requieren atención hoy"
        color={summaryStats?.nearSlaExpiry > 0 ? "warning" : "success"}
      />
      <StatCard
        label="FUERA DE SLA"
        value={summaryStats?.overdueSla || 0}
        icon={<OctagonAlert />}
        loading={loading}
        iconText={
          summaryStats?.overdueSla > 0 ? <TrendingDown /> : <CircleCheck />
        }
        variant="destructive"
        text="Sin resolver a tiempo"
        color={summaryStats?.overdueSla > 0 ? "destructive" : "success"}
      />
      <StatCard
        label="CUMPLIMIENTO SLA"
        value={`${summaryStats?.slaCompliance}%`}
        icon={<Award />}
        loading={loading}
        iconText={
          summaryStats?.slaCompliance >= 90 ? (
            <CircleCheck />
          ) : summaryStats?.slaCompliance > 40 ? (
            <TriangleAlert />
          ) : (
            <Skull />
          )
        }
        variant="success"
        text="Meta corporativa (>90%)"
        color={
          summaryStats?.slaCompliance >= 90
            ? "success"
            : summaryStats?.slaCompliance > 40
              ? "warning"
              : "destructive"
        }
      />
    </div>
  );
}
