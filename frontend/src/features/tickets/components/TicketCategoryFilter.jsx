
import { useEffect,useState } from "react";

import SelectFilter from "@/components/SelectFilter";
import { getCategories } from "@/features/tickets/services/categoryApi";

async function fetchCategories() {
  const categories = await getCategories();
  return categories;
}
export default function TicketCategoryFilter({ value = "", onChange }) {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);
  return(
    <div>
      <SelectFilter 
        placeholder="Categorias" 
        label="Categorías"
        value={value}
        onChange={onChange}
        options={[
          { value: "", label: "Todas las Categorías" },
          ...categories.map(category => ({ value: category.code, label: category.name }))
        ]} /> 
    </div>
  );
}