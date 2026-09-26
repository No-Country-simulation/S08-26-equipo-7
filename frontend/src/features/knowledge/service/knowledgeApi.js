import { toast } from "sonner";

import { apiRequest } from "@/services/apiService";

export async function getKnowledge() {
  try {
    return await apiRequest("/knowledge");
  } catch (error) {
    toast.error("Error fetching knowledge:", error);
    return [];
  }
}

export async function getKnowledgeById(id) {
  return apiRequest(`/knowledge/${id}`);
}

export async function createKnowledge(data) {
  return apiRequest("/knowledge", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateKnowledge(id, data) {
  return apiRequest(`/knowledge/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteKnowledge(id) {
  return apiRequest(`/knowledge/${id}`, {
    method: "DELETE",
  });
}
