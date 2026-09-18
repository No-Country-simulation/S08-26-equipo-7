import { apiRequest } from "@/services/apiService";

export async function getCategories() {
  try {
    return await apiRequest("/categories");
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
