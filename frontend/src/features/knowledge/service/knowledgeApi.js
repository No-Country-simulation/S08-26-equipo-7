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
    body: data,
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

export async function voteKnowledge(id, megusta) {
  return apiRequest(`/knowledge/${id}/votar`, {
    method: "POST",
    body: { megusta },
  });
}

export async function getMyKnowledgeVote(id) {
  return apiRequest(`/knowledge/${id}/mi-voto`, {
    method: "GET",
  });
}

export async function removeKnowledgeVote(id) {
  return apiRequest(`/knowledge/${id}/votar`, {
    method: "DELETE",
  });
}

export async function viewKnowledge(id) {
  return apiRequest(`/knowledge/${id}/view`, {
    method: "POST",
  });
}