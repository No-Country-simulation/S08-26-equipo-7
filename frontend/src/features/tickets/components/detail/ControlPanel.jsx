import { useEffect, useState } from "react";

import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStatus } from "@/features/tickets/services/statusApi";

import { useSlaCountdown } from "../../hooks/useSlaCountdown";

async function fetchStatus() {
  const status = await getStatus();
  return status;
}

export default function ControlPanel({ ticket }) {
  const [options, setOptions] = useState([]);
  const [valueOption, setValueOption] = useState(ticket.grupoEstado);
  const { timeLeft, isExpired, difference } = useSlaCountdown(ticket.slaDueAt);

  useEffect(() => {
    fetchStatus().then(setOptions);
  }, []);
  useEffect(() => {
    console.log(valueOption);
  }, [valueOption]);
  console.log(timeLeft, isExpired, difference);
  return (
    <div className="bg-card border-border order-3 rounded-lg border p-4 shadow-md lg:col-span-2 2xl:col-span-1">
      <div className="border-border border-b text-lg font-semibold">
        Panel de Control & SLA
      </div>
      <p className="text-muted-foreground mt-4 mb-2 text-sm">
        Estado de atención
      </p>
      <Select
        value={valueOption}
        onValueChange={(value) => setValueOption(value)}
      >
        <SelectTrigger className="border-border w-full border p-4">
          <SelectValue placeholder="Seleccione un estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Estado de atención</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option.name} value={option.name}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="mt-4">
        <p className="text-muted-foreground text-sm">Progreso del SLA</p>
        <Progress value={33} className="bg-foreground/15 h-2 w-full" />
      </div>
    </div>
  );
}
