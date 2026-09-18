export const TICKET_STATUS_CONFIG = {
  // Grupo 1: Pendientes
  SUBMITTED: {
    label: "Pendiente",
    badgeClass: "text-chart-2 bg-chart-2/10 border-chart-2/20",
  },
  CATEGORIZED: {
    label: "Pendiente",
    badgeClass: "text-chart-2 bg-chart-2/10 border-chart-2/20",
  },
  PRIORITIZED: {
    label: "Pendiente",
    badgeClass: "text-chart-2 bg-chart-2/10 border-chart-2/20",
  },

  // Grupo 2: En Proceso
  ASSIGNED: {
    label: "En Proceso",
    badgeClass: "text-primary bg-primary/10 border-primary/20",
  },
  IN_PROGRESS: {
    label: "En Proceso",
    badgeClass: "text-primary bg-primary/10 border-primary/20",
  },

  // Grupo 3: Puntos de Control / Alertas
  APPROVED: {
    label: "En Aprobación",
    badgeClass: "text-warning bg-warning/10 border-warning/20",
  },
  ESCALATED: {
    label: "Expirado",
    badgeClass: "text-destructive bg-destructive/10 border-destructive/20",
  },

  // Grupo 4: Éxito
  RESOLVED: {
    label: "Resuelto",
    badgeClass: "text-success bg-success/10 border-success/20",
  },
  CLOSED: {
    label: "Resuelto",
    badgeClass: "text-success bg-success/10 border-success/20",
  },
};
