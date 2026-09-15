import { Search } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function SearchFilter({ resultsCount }){
  return(
    <InputGroup className="min-w-0 max-w-none flex-1 border border-border sm:max-w-xs">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end" className="hidden sm:flex">{ resultsCount > 0 && resultsCount + " resultado" }</InputGroupAddon>
    </InputGroup>
  );
}