import SelectFilter from "@/components/SelectFilter";
export default function TicketStatusFilter() {
  return(
    <div>
      <SelectFilter 
        placeholder="Todos los Estados" 
        label="Estados" 
        options={[
          { value: "all", label: "Todos los Estados" },
          { value: "pendiente", label: "Pendiente" },
          { value: "en_proceso", label: "En Proceso" },
          { value: "en_aprobacion", label: "En Aprobación" },
          { value: "expirado", label: "Expirado" },
          { value: "resuelto", label: "Resuelto" },
        ]} />
    </div>
  );
}