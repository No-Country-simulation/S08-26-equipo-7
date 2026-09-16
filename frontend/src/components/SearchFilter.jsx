import { Search } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function SearchFilter({ resultsCount, value, onChange }){
  return(
    <InputGroup className="border border-border">
      <InputGroupInput placeholder="Buscar ticket por ID, título o responsable..." value={value} onChange={onChange} />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end" className="hidden sm:flex">{ resultsCount > 0 && resultsCount + " resultado" }</InputGroupAddon>
    </InputGroup>
  );
}