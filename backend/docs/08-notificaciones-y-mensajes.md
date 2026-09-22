# Notificaciones y mensajes

## Notificaciones

Sistema de avisos **in-app** por usuario. Se generan automáticamente en el backend ante eventos del flujo. Toda notificación pertenece a un usuario (`usuarioId`) y puede apuntar a un ticket (`ticketId`).

### Cuándo se generan

| Tipo | Se dispara cuando | Destinatarios |
|---|---|---|
| `TICKET_ASIGNADO` | Se asigna un ticket (automático o manual) | Agente asignado |
| `APROBACION_REQUERIDA` | Un ticket que requiere aprobación queda asignado | Supervisores y admins |
| `TICKET_APROBADO` | Un supervisor/admin aprueba | Solicitante y agente asignado |
| `TICKET_RESUELTO` | Se resuelve el ticket | Solicitante |
| `TICKET_CERRADO` | Se cierra el ticket (manual o auto-cierre) | Solicitante |
| `TICKET_ESCALADO` | Escalado manual o por SLA | Solicitante, agente y supervisores |
| `SLA_VENCIDO` | El scheduler marca el ticket como expirado | Solicitante, agente y supervisores |
| `TICKET_MENSAJE` | Alguien agrega un mensaje al hilo del ticket | La contraparte: si comenta el solicitante → agente asignado; si comenta otro → solicitante |

### Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/v1/notifications` | Notificaciones del usuario autenticado + `unread` |
| `GET` | `/api/v1/notifications/unread-count` | `{ "unread": N }` |
| `POST` | `/api/v1/notifications/{id}/read` | Marca una como leída (solo si es del usuario) |
| `POST` | `/api/v1/notifications/read-all` | Marca todas las del usuario como leídas |

Todas autenticadas. Ejemplo de `GET /notifications`:

```json
{
  "items": [
    {
      "id": "…",
      "usuarioId": "…",
      "ticketId": "…",
      "tipo": "TICKET_ASIGNADO",
      "mensaje": "Se te asignó el ticket HW-0003: Monitor roto",
      "leida": false,
      "creadoEn": "2026-09-15T20:22:00.000Z"
    }
  ],
  "unread": 1
}
```

> Los POST requieren el token CSRF (`X-XSRF-TOKEN`) como el resto de la API.

## Mensajes / comentarios del ticket

Hilo de comunicaciones del ticket, separado de la línea de tiempo.

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/v1/tickets/{id}/messages` | Lista los mensajes (más antiguo → más reciente). **Autenticado (requiere cookie `access_token`)** |
| `POST` | `/api/v1/tickets/{id}/messages` | Agrega un mensaje. Body `{ "message": "..." }`. **Autenticado + CSRF** |

- El autor sale del usuario autenticado (`autorEmail` / `autorNombre`).
- `409` si el mensaje viene vacío; `404` si el ticket no existe.
- **Límite:** `message` máx **500** caracteres (si se supera, devuelve 400 con `@Size`).
- Cada mensaje también deja un evento `MESSAGE` en la línea de tiempo (`GET /tickets/{id}/timeline`) para trazabilidad.
