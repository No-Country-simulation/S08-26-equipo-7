
import { useEffect,useState } from "react";

import SelectFilter from "@/components/SelectFilter";
import { getCategories } from "@/features/tickets/services/categoryApi";

async function fetchCategories() {
  const categories = await getCategories();
  return categories;
}
export default function TicketCategoryFilter() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);
  return(
    <div>
      <SelectFilter 
        placeholder="Todas las Categorias" 
        label="Categorías" 
        options={[
          { value: "all", label: "Todas las Categorías" },
          ...categories.map(category => ({ value: category.id, label: category.name }))
        ]} /> 
    </div>
  );
}