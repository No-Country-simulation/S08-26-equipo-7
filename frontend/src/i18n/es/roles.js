const ROLE_LABELS = {
  ADMIN: "Administrador",
  AGENT: "Agente",
  SUPERVISOR: "Supervisor",
  REQUESTER: "Solicitante",
};

export function getRoleLabel(role) {
  return ROLE_LABELS[role] || "Usuario";
}
