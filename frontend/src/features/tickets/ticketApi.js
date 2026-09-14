import { apiRequest } from "@/services/apiService";

export async function createTicket({
  description,
  category,
  priority,
  requiresApproval
}) {
  return apiRequest("tickets", {
    method: "POST",
    body: { description, category, priority, requiresApproval },
  });
}