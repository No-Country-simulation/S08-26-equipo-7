import { useEffect,useState } from "react";

import SelectFilter from "@/components/SelectFilter";
import { getPriority } from "@/features/tickets/services/priorityApi";

async function fetchPriority() {
  const priority = await getPriority();
  return priority;
}

export default function TicketPriorityFilter({ value = "", onChange }) {
  const [priority, setPriority] = useState([]);
  useEffect(() => {
    fetchPriority().then(setPriority);
  }, []);
  return(
    <div>
      <SelectFilter 
        placeholder="Prioridades" 
        label="Prioridades" 
        options={[
          { value: "", label: "Todas las Prioridades" },
          ...priority.map(p => ({ value: p.name, label: p.label }))
        ]}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}