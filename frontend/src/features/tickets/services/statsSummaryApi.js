import { apiRequest } from "@/services/apiService";

export async function getSummaryStats() {
  return apiRequest(`tickets/stats/summary`);
}
