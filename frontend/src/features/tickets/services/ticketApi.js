import { apiRequest } from "@/services/apiService";

export async function createTicket({ title, description, category }) {
  return apiRequest("tickets", {
    method: "POST",
    body: { title, description, category },
  });
}

export async function getTickets({
  limit = 10,
  offset = 0,
  category,
  group,
  priority,
  search,
} = {}) {
  const isAllOption = group === "all";
  const rawParams = {
    limit,
    offset,
    sort: "desc",
    category,
    group: isAllOption ? undefined : group,
    active: isAllOption ? false : undefined,
    priority,
    search: search?.trim(),
  };

  const cleanParams = Object.entries(rawParams).filter(
    ([, value]) => value !== undefined && value !== null && value !== "",
  );

  const queryParams = new URLSearchParams(cleanParams).toString();

  return apiRequest(`tickets?${queryParams}`, {
    method: "GET",
    cache: "no-store",
  });
}
