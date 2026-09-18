import ActivityFeed from "./ActivityFeed";
import ControlPanel from "./ControlPanel";
import DetailHeader from "./DetailHeader";
import DetailOverview from "./DetailOverview";
export default function DetailView({ ticket }) {
  return (
    <div className="grid w-full grid-cols-1 gap-6 py-4 lg:grid-cols-5 2xl:grid-cols-4">
      <DetailHeader ticket={ticket} />
      <div className="order-2 contents lg:col-span-3 lg:col-start-1 lg:row-start-2 lg:flex lg:flex-col lg:gap-6 2xl:col-span-3">
        <DetailOverview ticket={ticket} />
        <ActivityFeed activities={ticket} />
      </div>
      <ControlPanel ticket={ticket} />
    </div>
  );
}
