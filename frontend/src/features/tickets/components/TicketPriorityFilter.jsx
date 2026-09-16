import SelectFilter from "@/components/SelectFilter";

export default function TicketPriorityFilter({ value = "", onChange }) {
  return(
    <div>
      <SelectFilter 
        placeholder="Prioridades" 
        label="Prioridades" 
        options={[
          { value: "", label: "Todas las Prioridades" },
          { value: "LOW", label: "Baja" },
          { value: "MEDIUM", label: "Media" },
          { value: "HIGH", label: "Alta" },
          { value: "URGENT", label: "Crítica" },
        ]} 
        value={value}
        onChange={onChange}
      />
    </div>
  );
}