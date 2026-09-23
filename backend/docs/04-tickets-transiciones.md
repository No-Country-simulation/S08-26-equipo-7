# Transiciones de Estado (POST endpoints)

Todas las transiciones son `POST` y requieren autenticación + CSRF (header `X-XSRF-TOKEN`). Requieren rol y estado origen correcto.

| Endpoint | De qué estado | Roles permitidos | Notas |
|---|---|---|---|
| `POST /tickets/{id}/categorize?category=HARDWARE` | `SUBMITTED` | AGENT, SUPERVISOR, ADMIN | |
| `POST /tickets/{id}/prioritize?priority=HIGH` | `CATEGORIZED` | AGENT, SUPERVISOR, ADMIN | Fija el `slaDueAt` |
| `POST /tickets/{id}/assign?assignedTo={UUID}` | `PRIORITIZED` | SUPERVISOR, ADMIN | |
| `POST /tickets/{id}/approve` | `ASSIGNED` o `PENDING_APPROVAL` | SUPERVISOR, ADMIN | Solo si `requiresApproval=true`. Pasa directo a `IN_PROGRESS` |
| `POST /tickets/{id}/reject` | `ASSIGNED` o `PENDING_APPROVAL` | SUPERVISOR, ADMIN | Solo si `requiresApproval=true`. Devuelve a `ASSIGNED`, notifica al solicitante y al agente |
| `POST /tickets/{id}/start` | `ASSIGNED` o `APPROVED` | AGENT, SUPERVISOR, ADMIN | |
| `POST /tickets/{id}/escalate` | `IN_PROGRESS` | AGENT, SUPERVISOR, ADMIN | |
| `POST /tickets/{id}/resolve` | `IN_PROGRESS` o `ESCALATED` | AGENT, SUPERVISOR, ADMIN | Setea `resolvedAt` |
| `POST /tickets/{id}/close` | `RESOLVED` | El propio `REQUESTER`, SUPERVISOR, ADMIN | Setea `closedAt` |

## Respuestas

- `200` con el ticket actualizado
- `404` si no existe
- `409` si la transición no es válida para el estado actual o el rol no lo permite
- `403` si falta el token CSRF

---

**Ver también:** [Automatizaciones](04-tickets-automatizaciones.md) — el flujo automático al crear tickets ya hace categorize/prioritize/assign