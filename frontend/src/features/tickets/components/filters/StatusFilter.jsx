import { useEffect, useState } from "react";

import SelectFilter from "@/features/tickets/components/filters/SelectFilter";
import { getStatus } from "@/features/tickets/services/statusApi";

async function fetchStatus() {
  const status = await getStatus();
  return status;
}

export default function StatusFilter({ value = "", onChange }) {
  const [status, setStatus] = useState([]);
  useEffect(() => {
    fetchStatus().then(setStatus);
  }, []);
  return (
    <div>
      <SelectFilter
        placeholder="Estados"
        label="Estados"
        options={[
          { value: "", label: "Todos los Activos" },
          { value: "all", label: "Todos" },
          ...status.map((s) => ({ value: s.name, label: s.label })),
        ]}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
