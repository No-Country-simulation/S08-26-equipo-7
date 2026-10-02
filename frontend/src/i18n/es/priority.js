const PRIORITY = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
  URGENT: "Urgente",
};

export function translatePriority(priority) {
  return PRIORITY[priority] || priority;
}
