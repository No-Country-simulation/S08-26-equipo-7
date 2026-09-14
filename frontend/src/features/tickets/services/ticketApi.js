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