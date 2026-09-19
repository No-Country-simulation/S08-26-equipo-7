import { apiRequest } from "@/services/apiService";

export async function getKnowledge() {
  try {
    return await apiRequest("/knowledge");
  } catch (error) {
    console.error("Error fetching knowledge:", error);
    return [];
  }
}

export async function getKnowledgeById(id) {
  return apiRequest(`/knowledge/${id}`);
}