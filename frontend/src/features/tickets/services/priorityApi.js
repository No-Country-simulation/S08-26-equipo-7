import { apiRequest } from "@/services/apiService";

export async function getPriority() {
  try {
    return await apiRequest("/tickets/meta/priorities");
  } catch (error) {
    console.error("Error fetching priorities:", error);
    return [];
  }
}
