import { apiRequest } from "@/services/apiService";

export async function getUsers() {
  return apiRequest("users");
}

export async function createUser({ name, email, role, password, area }) {
  return apiRequest("users", {
    method: "POST",
    body: { name, email, role, password, area },
  });
}

export async function updateUser(id, payload) {
  return apiRequest(`users/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function changeUserPassword(id, newPassword) {
  return apiRequest(`users/${id}/password`, {
    method: "POST",
    body: { newPassword },
  });
}

export async function toggleUser(id) {
  return apiRequest(`users/${id}/toggle`, {
    method: "POST",
  });
}

export async function changePassword({ currentPassword, newPassword }) {
  return apiRequest("users/me/password", {
    method: "POST",
    body: { currentPassword, newPassword },
  });
}

export async function getAgents({ search = "", area = "" }) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (area) params.append("area", area);
  
  return apiRequest(`users/agents?${params.toString()}`);
}
