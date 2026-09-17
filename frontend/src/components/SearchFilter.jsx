import { Search } from "lucide-react"
import { useEffect,useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function SearchFilter({ value, onChange }){
  const[searchTerm, setSearchTerm] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedText = searchTerm.trim();

      if (trimmedText.length >= 3 || trimmedText === "") {
        if (trimmedText !== value) {
          onChange(trimmedText);
        }
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, value, onChange]);
  return(
    <InputGroup className="border border-border">
      <InputGroupInput
        placeholder="Buscar ticket por ID, título o responsable..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}