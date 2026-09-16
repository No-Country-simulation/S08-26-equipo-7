import { apiRequest } from "@/services/apiService";

export async function createTicket({
  title,
  description,
  category,
}) {
  return apiRequest("tickets", {
    method: "POST",
    body: { title, description, category },
  });
}

export async function getTickets({
  limit = 10,
  offset = 0,
  category,
  status,
  priority,
  search,
} = {}) {
  // 1. Agrupamos todos los parámetros en un objeto
  const rawParams = {
    limit,
    offset,
    sort: "desc",
    category,
    status,
    priority,
    search: search?.trim(), // Limpiamos espacios innecesarios
  };

  // 2. Filtramos claves que tengan valor (descartamos undefined, null, "")
  const cleanParams = Object.entries(rawParams).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );

  // 3. Generamos los query params automáticamente y codificados
  const queryParams = new URLSearchParams(cleanParams).toString();

  return apiRequest(`tickets?${queryParams}`, {
    method: "GET",
  });
}