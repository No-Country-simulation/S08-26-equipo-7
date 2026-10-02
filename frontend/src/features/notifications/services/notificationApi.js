import { apiRequest } from "@/services/apiService";

export function getNotifications() {
  return apiRequest("notifications", {
    method: "GET",
    cache: "no-store",
  });
}

export function markNotificationAsRead(id) {
  return apiRequest(`notifications/${id}/read`, {
    method: "POST",
  });
}

export function markAllNotificationsAsRead() {
  return apiRequest("notifications/read-all", {
    method: "POST",
  });
}