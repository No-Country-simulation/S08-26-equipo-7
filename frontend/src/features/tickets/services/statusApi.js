import { apiRequest } from "@/services/apiService";

export async function getStatus() {
  try {
    return await apiRequest("/tickets/meta/groups");
  } catch (error) {
    console.error("Error fetching status:", error);
    return [];
  }
}