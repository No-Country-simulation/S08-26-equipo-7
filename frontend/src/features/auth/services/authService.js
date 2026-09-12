import { apiRequest } from "@/services/apiService";

export async function login(email, password) {
  return apiRequest("auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function forgotPassword(email) {
  return apiRequest("auth/recover-password", {
    method: "POST",
    body: { email },
  });
}

export async function logout() {
  await apiRequest("auth/logout", {
    method: "POST",
  });
  return true;
}

export async function getCurrentUser() {
  try {
    return await apiRequest("auth/me");
  } catch {
    return null;
  }
}