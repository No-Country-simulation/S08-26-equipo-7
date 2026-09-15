const PRIORITY = {
  "LOW": "Baja",
  "MEDIUM": "Media",
  "HIGH": "Alta",
  "URGENT": "Urgente"
};


export function traslatePriority(priority) {
  return PRIORITY[priority] || priority;
}