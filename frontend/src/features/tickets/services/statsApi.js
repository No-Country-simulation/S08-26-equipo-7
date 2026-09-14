import { apiRequest } from "@/services/apiService";

export async function getMonthlyStats(month) {
  const query = month ? `?month=${month}` : "";
  return apiRequest(`tickets/stats/monthly${query}`);
}
