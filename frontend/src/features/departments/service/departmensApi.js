import { apiRequest } from "@/services/apiService";

export async function getDepartments() {
  return apiRequest("categories/all");
}

export async function createDepartment({
  code,
  name,
  description,
  requiresApproval,
}) {
  return apiRequest("categories", {
    method: "POST",
    body: { code, name, description, requiresApproval },
  });
}

export async function updateDepartment(id, payload) {
  return apiRequest(`categories/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function toggleDepartment(id) {
  return apiRequest(`categories/${id}/toggle`, {
    method: "POST",
  });
}
