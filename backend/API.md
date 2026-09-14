# API - ServiceFlow Backend

Base URL: `http://localhost:8080/api/v1`

Todas las respuestas son JSON. Los errores siguen el formato `{"error": "mensaje"}`.

## Seguridad

- Login con email + password con JWT almacenado en **cookie HttpOnly** (name=`access_token`).
- Para las peticiones que modifican datos (POST) **excepto** `login`, `recover-password` y `logout`, hay que mandar el header **`X-XSRF-TOKEN`** con el valor de la cookie `XSRF-TOKEN` (el front la lee del navegador y la reenvía).

## Errores

| Código | Significado |
|---|---|
| `401` | No autenticado — falta la cookie `access_token` |
| `403` | Autenticado pero sin permiso (rol insuficiente o falta CSRF) |
| `404` | Recurso no encontrado |
| `409` | Conflicto — email duplicado, categoría duplicada, transición inválida |
| `422` | Error de validación — campos requeridos, formato inválido, contraseña débil |

## Roles

| Rol | Qué puede hacer |
|---|---|
| `REQUESTER` | Crear tickets y cerrar los suyos |
| `AGENT` | Categorizar, priorizar, atender, escalar, resolver |
| `SUPERVISOR` | Asignar, aprobar, escalar, cerrar |
| `ADMIN` | Todo + crear usuarios + gestionar categorías |

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

### POST /api/v1/auth/recover-password
Genera un ticket de recuperación — **siempre devuelve 200** (no revela si el email existe). Inserta el ticket solo cuando el email existe en la BD. Unidad de rate limit: **máx. 3 peticiones / 15 min por IP** (la 4ta responde `429`). Es una ruta **pública** (no requiere token).

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
- `401` si no hay token

### POST /auth/logout
Cierra la sesión (borra la cookie).

```json
// respuesta 200
{ "mensaje": "Sesión cerrada" }
```

---

## Categorías

Las categorías se gestionan desde la BD. El front carga los tickets dinámicamente desde esta tabla.

### GET /categories
Lista categorías **activas**. **Ruta pública** (no requiere token).

```json
// respuesta 200
[
  { "id": "uuid", "code": "IT", "name": "Infraestructura IT",
    "description": "Equipos, redes, VPN y sistemas", "active": true, "requiresApproval": false },
  { "id": "uuid", "code": "ACCESS", "name": "Accesos y Seguridad",
    "description": "Usuarios, permisos y credenciales", "active": true, "requiresApproval": true },
  { "id": "uuid", "code": "HARDWARE", "name": "Hardware",
    "description": "Equipos y periféricos", "active": true, "requiresApproval": true },
  { "id": "uuid", "code": "FACILITIES", "name": "Facilities y Logística",
    "description": "Espacios físicos, mantenimiento y logística", "active": true, "requiresApproval": false },
  { "id": "uuid", "code": "FINANCE", "name": "Finanzas y Compras",
    "description": "Compras, gastos y viáticos", "active": true, "requiresApproval": true }
]
```

### GET /categories/all
Lista **todas** las categorías (incluyendo inactivas). **Solo ADMIN**.

```json
// body
{ "code": "SECURITY", "name": "Ciberseguridad", "description": "Filtraciones, malware, ransomware", "requiresApproval": true }
// respuesta 201
{ "id": "uuid", "code": "SECURITY", "name": "Ciberseguridad", "description": "Filtraciones, malware, ransomware", "active": true, "requiresApproval": true }
```
- `409` si el `code` ya existe
- `422` si falta `code` o `name`

### PUT /categories/{id}
Actualiza nombre, descripción, estado o `requiresApproval`. **Solo ADMIN**.

```json
// body (todos opcionales)
{ "name": "Nuevo nombre", "description": "...", "active": false, "requiresApproval": true }
// respuesta 200 → objeto actualizado
```
- `404` si no existe el ID

### POST /categories/{id}/toggle
Activa/desactiva una categoría. **Solo ADMIN**.

```json
// respuesta 200
{ "message": "Category toggled" }
```
- `404` si no existe

---

## Usuarios

### POST /users
Crea un usuario. **Solo ADMIN**.

```json
// body
{ "name": "Mariana López", "email": "mariana.lopez@empresa.com", "role": "AGENT", "password": "ClaveSegura1" }
// respuesta 201 — NUNCA devuelve la contraseña
{ "id": "uuid", "name": "Mariana López", "email": "mariana.lopez@empresa.com", "role": "AGENT", "createdAt": "2026-09-14T09:21:17" }
```

| Error | Código | Causa |
|---|---|---|
| `Authentication required` | `401` | Sin cookie `access_token` |
| `Forbidden: insufficient role` | `403` | El usuario autenticado no tiene rol `ADMIN` |
| `Email already registered: ...` | `409` | El email ya está en uso |
| `code and name are required` | `422` | Faltan campos requeridos |
| `email is invalid` | `422` | Formato de email incorrecto |
| `role is invalid. Allowed roles: ...` | `422` | Rol inexistente en el enum |
| `password must be at least 8 characters` | `422` | Contraseña demasiado corta |

**Roles permitidos para crear:** `REQUESTER`, `AGENT`, `SUPERVISOR`, `ADMIN`.

### GET /users
Lista todos los usuarios. **Solo ADMIN**. La respuesta **nunca incluye** `passwordHash`.

---

## Tickets

Ciclo de vida de un ticket: `SUBMITTED → CATEGORIZED → PRIORITIZED → ASSIGNED → (APPROVED si requiere aprobación) → IN_PROGRESS → (ESCALATED) → RESOLVED → CLOSED`

### Campos del ticket (respuesta)

| Campo | Descripción |
|---|---|
| `id` | UUID del ticket |
| `email` | Email del solicitante |
| `title` | Título del ticket (requerido en creación) |
| `category` | Code de la categoría (ej. `IT`, `HARDWARE`, `FINANCE`) |
| `description` | Descripción del problema |
| `priority` | `LOW`, `MEDIUM`, `HIGH`, `URGENT` — fijada en `MEDIUM` al crear; solo el supervisor la cambia vía `prioritize` |
| `status` | Estado del ciclo de vida (lista arriba) |
| `requiresApproval` | Viene de la categoría (automático) |
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
Crea un ticket como `SUBMITTED`. Usa el email del usuario autenticado. **La prioridad siempre es `MEDIUM`** (seteada en el backend, no enviada desde el front). `requiresApproval` viene automáticamente de la categoría seleccionada.

```json
// body
{
  "title": "No enciende mi notebook",
  "description": "No arranca el equipo al presionar el botón de encendido",
  "category": "HARDWARE"
}
```
- `title` y `description` y `category` son **requeridos** (400 si falta alguno)
- `409` si la categoría no existe o está inactiva
- `201` respuesta con el ticket creado (`priority: "MEDIUM"`, `requiresApproval` según categoría)

### GET /tickets
Lista tickets con filtros opcionales por query string:
`GET /tickets?status=IN_PROGRESS&category=HARDWARE&priority=HIGH`

### GET /tickets/{id}
Devuelve un ticket por UUID. `404` si no existe.

### Transiciones (todas `POST`)

| Endpoint | De qué estado | Roles permitidos |
|---|---|---|
| `POST /tickets/{id}/categorize?category=HARDWARE` | `SUBMITTED` | AGENT, SUPERVISOR, ADMIN |
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
  "byCategory": { "IT": 2, "HARDWARE": 1, ... }
}
```

---

## Ejemplo rápido (flujo completo con CSRF)

1. `POST /auth/login` → guarda la cookie `access_token`.
2. El navegador ya tiene la cookie `XSRF-TOKEN`; se debe reenviar su valor en el header `X-XSRF-TOKEN` en cada POST.
3. `GET /categories` → obtiene las categorías para el formulario.
4. `POST /tickets` con `{ "title": "...", "description": "...", "category": "HARDWARE" }` → `201` (ticket `SUBMITTED`, prioridad `MEDIUM` automática, `requiresApproval` desde la categoría).
5. `POST /tickets/{id}/categorize?category=HARDWARE` → `CATEGORIZED`.
6. `POST /tickets/{id}/prioritize?priority=HIGH` → `PRIORITIZED` (SLA 8h, solo supervisor decide la urgencia).
7. `POST /tickets/{id}/assign?assignedTo={agenteId}` → `ASSIGNED`.
8. `POST /tickets/{id}/approve` (si `requiresApproval=true`) → `APPROVED`.
9. `POST /tickets/{id}/start` → `IN_PROGRESS`.
10. `POST /tickets/{id}/resolve` → `RESOLVED`.
11. `POST /tickets/{id}/close` → `CLOSED`.
12. `GET /tickets/stats/monthly?month=2026-09` → estadísticas.