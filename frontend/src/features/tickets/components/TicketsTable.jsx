import TicketsTableManager from "./TicketsTableManager";
export default function TicketsTable() {
  return(
    <div className="py-4 bg-card rounded-lg my-4 border border-border shadow-md">
      <TicketsTableManager limit={5} offset={0} resume={false} />
    </div>
  );
};