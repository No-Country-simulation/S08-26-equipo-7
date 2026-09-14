import { Award,CircleCheck,Clock,OctagonAlert,Ticket,TrendingDown,TrendingUp,TriangleAlert } from 'lucide-react';

import StatCard from '@/components/StatCard';

export default function DashboardStats() {
  return (
    <div className='flex flex-wrap justify-between'>
      <StatCard label="TICKETS ACTIVOS" value="3" icon={<Ticket />} iconText={<TrendingUp />} text="+12% vs semana anterior" color="success" />
      <StatCard label="PRÓXIMOS A VENCER SLA" value="1" icon={<Clock />}  iconText={<TriangleAlert />} variant="warning" text="Requieren atención hoy" color="warning" />
      <StatCard label="FUERA DE SLA" value="1" icon={<OctagonAlert />} iconText={<TrendingDown />} variant="destructive" text="Escalados automaticamente" color="destructive" />
      <StatCard label="CUMPLIMIENTO SLA" value="94.8%" icon={<Award />} iconText={<CircleCheck />} variant="success" text="Meta corporativa (>90%)" color="success" />
    </div>
  );
}