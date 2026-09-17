import { apiRequest } from "@/services/apiService";

export async function getCategories() {
  try {
    return await apiRequest("/tickets/meta/priorities");
  } catch (error) {
    console.error("Error fetching priorities:", error);
    return [];
  }
}