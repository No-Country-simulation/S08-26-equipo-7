import SelectFilter from "@/components/SelectFilter";
export default function TicketStatusFilter({ value = "", onChange }) {
  return(
    <div>
      <SelectFilter 
        placeholder="Estados" 
        label="Estados" 
        options={[
          { value: "", label: "Todos los Estados" },
          { value: "pendiente", label: "Pendiente" },
          { value: "en_proceso", label: "En Proceso" },
          { value: "en_aprobacion", label: "En Aprobación" },
          { value: "expirado", label: "Expirado" },
          { value: "resuelto", label: "Resuelto" },
        ]}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}