const API_MESSAGE_TRANSLATIONS = {
  "Invalid credentials": "El correo o la contraseña son incorrectos",
  "description is required": "La descripción es obligatoria",
  "Ticket not found": "No se encontró el ticket",
  "Role not found": "No se encontró el rol del usuario",
  "This ticket does not require approval": "Este ticket no requiere aprobación",
  "Too many requests, try again later": "Demasiadas solicitudes. Inténtalo más tarde",
  "If the email exists, we will process the request":
    "Si el correo existe, procesaremos la solicitud",
};

export function translateApiMessage(message, status) {
  if (!message) {
    return "La solicitud no pudo completarse";
  }

  if (API_MESSAGE_TRANSLATIONS[message]) {
    return API_MESSAGE_TRANSLATIONS[message];
  }

  if (message.startsWith("User not found with email:")) {
    return "No se encontró un usuario con ese correo";
  }

  if (message.startsWith("Ticket must be assigned")) {
    return "El ticket debe estar asignado y aprobado si es necesario antes de iniciarlo";
  }

  if (message.startsWith("Ticket must be in progress or escalated")) {
    return "El ticket debe estar en progreso o escalado antes de resolverlo";
  }

  if (message.startsWith("Invalid transition:")) {
    return "La transición no es válida para el estado actual del ticket";
  }

  if (message === "Your role does not allow this action") {
    return "Tu rol no permite realizar esta acción";
  }

  if (message === "Only the requester, a supervisor or an admin can close the ticket") {
    return "Solo el solicitante, un supervisor o un administrador pueden cerrar el ticket";
  }

  if (status === 401) {
    return "No tienes autorización para realizar esta acción";
  }

  if (status === 403) {
    return "No tienes permisos para realizar esta acción";
  }

  return message;
}
