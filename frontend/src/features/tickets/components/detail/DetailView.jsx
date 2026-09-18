import ActivityFeed from "./ActivityFeed";
import ControlPanel from "./ControlPanel";
import DetailHeader from "./DetailHeader";
import DetailOverview from "./DetailOverview";

export default function DetailView({ ticket }) {
  return (
    <div className="grid w-full gap-6 py-4 lg:grid-cols-5 2xl:grid-cols-4">
      <DetailHeader ticket={ticket} />
      <DetailOverview ticket={ticket} />
      <ControlPanel ticket={ticket} />
      <ActivityFeed activities={ticket} />
    </div>
  );
}
