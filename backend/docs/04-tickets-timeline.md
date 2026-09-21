# Línea de Tiempo (Timeline) del Ticket

## GET /tickets/{id}/timeline

Línea de tiempo (historial) del ticket, ordenada de más antigua a más reciente. **Autenticado (requiere cookie `access_token`)**. `404` si el ticket no existe.

**Headers requeridos:**
- `Cookie: access_token=<jwt>` (HttpOnly, se setea en login)
- `X-XSRF-TOKEN: <valor de cookie XSRF-TOKEN>` (solo para POST, no para GET)

```json
[
  {
    "id": "0f3b...",
    "ticketId": "e392...",
    "tipo": "PRIORITIZED",
    "descripcion": "Prioridad asignada: HIGH (SLA 8h)",
    "actorEmail": "agente@serviceflow.com",
    "actorNombre": "Agente Uno",
    "fecha": "2026-09-16T23:59:47.833Z"
  }
]
```

## Tipos de evento

| Tipo | Descripción que se registra |
|---|---|
| `CREATED` | Ticket creado |
| `CATEGORIZED` | Categoría asignada: `CODIGO` (manual) · o "Categoría asignada automáticamente" (actor "Sistema") |
| `PRIORITIZED` | Prioridad asignada: `PRIORIDAD` (SLA `Nh`) · o automática (actor "Sistema") |
| `ASSIGNED` | Asignado al agente `NOMBRE` · o automático (actor "Sistema") |
| `APPROVAL_REQUIRED` | Requiere autorización gerencial obligatoria (actor "Sistema") |
| `APPROVED` | Ticket aprobado |
| `STARTED` | Trabajo iniciado |
| `ESCALATED` | Ticket escalado manualmente · o "Ticket expirado por SLA vencido" (automático, actor "Sistema (SLA)") |
| `RESOLVED` | Ticket resuelto |
| `CLOSED` | Ticket cerrado · o "cerrado automáticamente por inactividad tras resolución" (actor "Sistema (auto-cierre)") |
| `MESSAGE` | Mensaje de `NOMBRE`: `texto` |

`actorEmail` y `actorNombre` identifican quién realizó la acción. Las acciones del sistema usan `actorNombre = "Sistema"`, `"Sistema (SLA)"` o `"Sistema (auto-cierre)"`. La fecha es UTC.

---

**Ver también:** [Transiciones](04-tickets-transiciones.md) · [Automatizaciones](04-tickets-automatizaciones.md)