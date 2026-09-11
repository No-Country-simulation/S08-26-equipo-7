# API - ServiceFlow Backend

Base URL: `http://localhost:8080/api/v1`

Todas las respuestas son JSON. Los errores siguen el formato `{"error": "mensaje"}`.

## Seguridad

- Login con email + password con JWT almacenado en **cookie HttpOnly** (name=`access_token`).
- Para las peticiones que modifican datos (POST) **excepto** `login`, `recover-password` y `logout`, hay que mandar el header **`X-XSRF-TOKEN`** con el valor de la cookie `XSRF-TOKEN` (el front la lee del navegador y la reenvía).

## Roles

| Rol | Qué puede hacer |
|---|---|
| `REQUESTER` | Crear tickets y cerrar los suyos |
| `AGENT` | Categorizar, priorizar, atender, escalar, resolver |
| `SUPERVISOR` | Asignar, aprobar, escalar, cerrar |
| `ADMIN` | Todo |

---

## Auth

### POST /auth/login
Inicia sesión. Setea la cookie `access_token` (HttpOnly).

```json
// body
{ "email": "admin@serviceflow.com", "password": "Admin123!" }
// respuesta 200
{ "nombre": "Alejandro", "rol": "ADMIN" }
```
- `400` si falta algún campo · `401` si las credenciales son inválidas

### POST /auth/forgotPassword (recover-password)
Genera un ticket de recuperación — **siempre devuelve 200** (no revela si el email existe). Inserta el ticket solo cuando el email existe en la BD. Unidad de rate limit: **máx. 3 peticiones / 15 min por IP** (la 4ta responde `429`).

```json
// body
{ "email": "usuario@empresa.com" }
// respuesta 200
{ "message": "If the email exists, we will process the request" }
```

### GET /auth/me
Devuelve la sesión actual (requiere cookie `access_token`).

```json
// respuesta 200
{ "nombre": "Alejandro", "rol": "ADMIN" }
```

### POST /auth/logout
Cierra la sesión (borra la cookie).

```json
// respuesta 200
{ "mensaje": "Sesión cerrada" }
```

---

## Tickets

Ciclo de vida de un ticket: `SUBMITTED → CATEGORIZED → PRIORITIZED → ASSIGNED → (APPROVED si requiere aprobación) → IN_PROGRESS → (ESCALATED) → RESOLVED → CLOSED`

### Campos del ticket (respuesta)

| Campo | Descripción |
|---|---|
| `id` | UUID del ticket |
| `email` | Email del solicitante |
| `category` | `PASSWORD_RECOVERY`, `QUERY`, `SYSTEM_ERROR`, `OTHER` |
| `description` | Descripción del problema |
| `priority` | `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| `status` | Estado del ciclo de vida (lista arriba) |
| `requiresApproval` | `true`/`false` · si el ticket requiere aprobación antes de atenderse |
| `assignedTo` | UUID del agente asignado (o `null`) |
| `slaDueAt` | Fecha tope según prioridad |
| `resolvedAt` / `closedAt` | Fechas de resolución/cierre (o `null`) |
| `createdAt` | Fecha de creación |

### SLA según prioridad (desde la priorización)

| Prioridad | Tope |
|---|---|
| `URGENT` | 4 h |
| `HIGH` | 8 h |
| `MEDIUM` | 24 h |
| `LOW` | 72 h |

### POST /tickets
Crea un ticket como `SUBMITTED`. Usa el email del usuario autenticado.

```json
// body
{
  "description": "No puedo abrir el sistema",
  "category": "SYSTEM_ERROR",
  "priority": "URGENT",
  "requiresApproval": true
}
```
- `category`, `priority` y `requiresApproval` son **opcionales** (defaults: `QUERY`, `MEDIUM`, `false`).
- `400` si falta `description` · `201` respuesta con el ticket creado

### GET /tickets
Lista tickets con filtros opcionales por query string:
`GET /tickets?status=IN_PROGRESS&category=QUERY&priority=HIGH`

### GET /tickets/{id}
Devuelve un ticket por UUID. `404` si no existe.

### Transiciones (todas `POST`)

| Endpoint | De qué estado | Roles permitidos |
|---|---|---|
| `POST /tickets/{id}/categorize?category=QUERY` | `SUBMITTED` | AGENT, SUPERVISOR, ADMIN |
| `POST /tickets/{id}/prioritize?priority=HIGH` | `CATEGORIZED` | AGENT, SUPERVISOR, ADMIN · fija el `slaDueAt` |
| `POST /tickets/{id}/assign?assignedTo={UUID}` | `PRIORITIZED` | SUPERVISOR, ADMIN |
| `POST /tickets/{id}/approve` | `ASSIGNED` | SUPERVISOR, ADMIN · solo si `requiresApproval=true` |
| `POST /tickets/{id}/start` | `ASSIGNED` o `APPROVED` | AGENT, SUPERVISOR, ADMIN |
| `POST /tickets/{id}/escalate` | `IN_PROGRESS` | AGENT, SUPERVISOR, ADMIN |
| `POST /tickets/{id}/resolve` | `IN_PROGRESS` o `ESCALATED` | AGENT, SUPERVISOR, ADMIN · setea `resolvedAt` |
| `POST /tickets/{id}/close` | `RESOLVED` | El propio `REQUESTER`, SUPERVISOR, ADMIN · setea `closedAt` |

- `200` con el ticket actualizado · `404` si no existe · `409` si la transición no es válida para el estado actual o el rol no lo permite · `403` si falta el token CSRF

### GET /tickets/stats/monthly
Estadísticas para gráficas del admin. `month` opcional en formato `YYYY-MM` (default: mes actual).

```json
// respuesta 200
{
  "created": 5,
  "resolved": 3,
  "resolvedOnTime": 2,
  "resolvedLate": 1,
  "avgResolutionHours": 6.5,
  "byStatus": { "SUBMITTED": 1, "RESOLVED": 3, ... },
  "byCategory": { "PASSWORD_RECOVERY": 2, "QUERY": 1, ... }
}
```

---

## Ejemplo rápido (flujo completo con CSRF)

1. `POST /auth/login` → guarda la cookie `access_token`.
2. El navegador ya tiene la cookie `XSRF-TOKEN`; se debe reenviar su valor en el header `X-XSRF-TOKEN` en cada POST.
3. `POST /tickets` → `201` (ticket `SUBMITTED`).
4. `POST /tickets/{id}/categorize?category=QUERY` → `CATEGORIZED`.
5. `POST /tickets/{id}/prioritize?priority=HIGH` → `PRIORITIZED` (SLA 8h).
6. `POST /tickets/{id}/assign?assignedTo={agenteId}` → `ASSIGNED`.
7. `POST /tickets/{id}/approve` (si `requiresApproval=true`) → `APPROVED`.
8. `POST /tickets/{id}/start` → `IN_PROGRESS`.
9. `POST /tickets/{id}/resolve` → `RESOLVED`.
10. `POST /tickets/{id}/close` → `CLOSED`.
11. `GET /tickets/stats/monthly?month=2026-09` → estadísticas.