import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react"

export default function SearchApp(){
  return(
    <InputGroup className="min-w-0 max-w-none flex-1 border border-border sm:max-w-xs">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end" className="hidden sm:flex">12 results</InputGroupAddon>
    </InputGroup>
  );
}