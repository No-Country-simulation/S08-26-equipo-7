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

export async function getTickets(limit, offset) {
  return apiRequest(`tickets?limit=${limit}&offset=${offset}`, {
    method: "GET",
  });
}