# API - ServiceFlow Backend

Base URL: `http://localhost:8080/api/v1`

Todas las respuestas son JSON. Los errores siguen el formato `{"error": "mensaje"}`.

## Seguridad

- Login con email + password con JWT almacenado en **cookie HttpOnly** (name=`access_token`).
- Para las peticiones que modifican datos (POST) **excepto** `login`, `recover-password` y `logout`, hay que mandar el header **`X-XSRF-TOKEN`** con el valor de la cookie `XSRF-TOKEN` (el front la lee del navegador y la reenvía).
- **Antes del primer POST**, llamá a `GET /auth/csrf` para obtener el token y la cookie (evita el 403 de una primera request).

## Documentación modular

Toda la API está modularizada por tema en la carpeta **[`docs/`](docs/00-indice.md)**:

| Archivo | Contenido |
|---|---|
| [`00-indice.md`](docs/00-indice.md) | Índice global: seguridad, errores, roles y mapa de módulos |
| [`01-auth.md`](docs/01-auth.md) | `login`, `csrf`, `recover-password`, `me`, `logout` |
| [`02-categorias.md`](docs/02-categorias.md) | `categories` (GET, POST, PUT, toggle) |
| [`03-usuarios.md`](docs/03-usuarios.md) | `users` (POST, GET) |
| [`04-tickets.md`](docs/04-tickets.md) | `tickets` (POST, GET, GET by id, transiciones, código corto, SLA) |
| [`05-tickets-estadisticas.md`](docs/05-tickets-estadisticas.md) | `tickets/stats/monthly` y `tickets/stats/summary` |
| [`06-base-conocimiento.md`](docs/06-base-conocimiento.md) | `knowledge` (GET, view, POST, PUT) |
| [`07-flujo-csrf.md`](docs/07-flujo-csrf.md) | Ejemplo completo: csrf → login → crear/transicionar ticket |

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

### GET /auth/csrf
Devuelve el token CSRF y setea la cookie `XSRF-TOKEN` (público). **Llamar antes del primer POST** para no recibir 403 en la primera escritura (el token también sale en la cookie de una response rechazada, pero mejor pedirlo acá una vez).

```json
// respuesta 200
{ "token": "a654aa5c-5e7e-40a8-af97-52ce98fd981c" }
```

Uso: el mismo valor del body va como header `X-XSRF-TOKEN` en los POST siguientes.

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

## Automatizaciones del flujo

El backend automatiza lo máximo posible para que un ticket no dependa de gestión humana salvo que realmente la necesite. Al **crear** un ticket, además de registrarlo, el sistema:

1. **Auto-clasifica** (`CATEGORIZED`) con la categoría enviada.
2. **Auto-prioriza** (`PRIORITIZED`) con la prioridad por defecto de la categoría (`categorias.prioridad_defecto`) y calcula el SLA.
3. **Auto-asigna** (`ASSIGNED`) al agente **con menos tickets activos** (`role=AGENT`). Si no hay agentes, queda en `PRIORITIZED`.
4. Si la categoría **requiere aprobación**, deja el ticket en `ASSIGNED`, registra `APPROVAL_REQUIRED` en la línea de tiempo y notifica a supervisores/admin.
5. Notifica al agente asignado (`TICKET_ASIGNADO`).

Cada paso se registra en la línea de tiempo con `actorNombre = "Sistema"`.

### Vencimiento automático del SLA (EXPIRADO)

Un **scheduler** revisa los tickets cada 60 segundos (configurable con `SLA_EXPIRY_CHECK_MS`, default `60000`):

- Si un ticket **activo** (distinto de `RESOLVED`/`CLOSED`/`ESCALATED`) tiene `slaDueAt` **vencido**, cambia solo a `ESCALATED` (grupo `EXPIRADO`), registra el evento y **notifica** al solicitante, al agente asignado y a los supervisores (`SLA_VENCIDO`).
- No toca tickets ya `ESCALATED`, `RESOLVED` o `CLOSED`.

### Auto-cierre de resueltos inactivos

Otro **scheduler** cierra automáticamente los tickets `RESOLVED` que llevan más de `48 h` sin actividad (configurable con `AUTO_CLOSE_RESOLVED_HOURS`, revisión cada `AUTO_CLOSE_CHECK_MS`, default `300000`):

- Pasa el ticket a `CLOSED`, registra el evento `CLOSED` ("cerrado automáticamente por inactividad tras resolución") y notifica al solicitante.

### Prioridad por defecto por categoría

Cada categoría tiene `prioridadDefecto` (`LOW`, `MEDIUM`, `HIGH`, `URGENT`, default `MEDIUM`) que se usa al auto-priorizar. Se administra desde `POST/PUT /categories` (campo `prioridadDefecto`) y viene en `GET /categories`.


## GET /tickets/{id}/timeline

Historial del ticket (línea de tiempo), ordenado de más antigua a más reciente. Autenticado. `404` si no existe.

```json
[
  { "tipo": "CREATED", "descripcion": "Ticket creado", "actorEmail": "request@empresa.com", "actorNombre": "Usuario Uno", "fecha": "2026-09-15T20:19:44.262Z" },
  { "tipo": "PRIORITIZED", "descripcion": "Prioridad asignada: HIGH (SLA 8h)", "actorEmail": "agente@serviceflow.com", "actorNombre": "Agente Uno", "fecha": "2026-09-15T20:20:01.100Z" }
]
```

Tipos de evento: `CREATED`, `CATEGORIZED`, `PRIORITIZED`, `ASSIGNED`, `APPROVAL_REQUIRED`, `APPROVED`, `STARTED`, `ESCALATED` (manual o automático por SLA), `RESOLVED`, `CLOSED` (manual o auto-cierre), `MESSAGE` (mensaje agregado al hilo). `actorEmail`/`actorNombre` = quién ejecutó la acción; las acciones automáticas usan `actorNombre = "Sistema"`, `"Sistema (SLA)"` o `"Sistema (auto-cierre)"`.

## GET /tickets/{id}/messages

Lista los mensajes/comentarios del ticket, ordenados de más antiguo a más reciente. Autenticado. `404` si el ticket no existe.

```json
[
  { "id": "…", "ticketId": "…", "autorEmail": "request@empresa.com", "autorNombre": "Usuario Uno", "mensaje": "Necesario para desarrollo", "creadoEn": "2026-09-15T20:21:00.000Z" }
]
```

## POST /tickets/{id}/messages

Agrega un mensaje al hilo del ticket. Autenticado. Body:

```json
{ "message": "Necesario para desarrollo de interfaces" }
```

- `201` con el mensaje creado (`autorEmail`/`autorNombre` del usuario autenticado).
- `409` si el mensaje viene vacío.
- `404` si el ticket no existe.
- Además del hilo, se registra un evento `MESSAGE` en la línea de tiempo y se notifica a la contraparte (`TICKET_MENSAJE`): si comenta el solicitante se avisa al agente asignado; si comenta cualquier otro, se avisa al solicitante.

## Notificaciones

Sistema de avisos in-app por usuario. Se generan automáticamente en: creación/asignación (`TICKET_ASIGNADO`), aprobación requerida (`APROBACION_REQUERIDA`), aprobación (`TICKET_APROBADO`), resolución (`TICKET_RESUELTO`), cierre (`TICKET_CERRADO`), escalado (`TICKET_ESCALADO`), vencimiento de SLA (`SLA_VENCIDO`) y mensaje nuevo en el hilo (`TICKET_MENSAJE`).

### GET /notifications
Notificaciones del usuario autenticado (más recientes primero) + contador de no leídas. Autenticado.

```json
{ "items": [ { "id": "…", "usuarioId": "…", "ticketId": "…", "tipo": "TICKET_ASIGNADO", "mensaje": "Se te asignó el ticket HW-0003: Monitor roto", "leida": false, "creadoEn": "2026-09-15T20:22:00.000Z" } ], "unread": 3 }
```

### GET /notifications/unread-count
Devuelve `{ "unread": 3 }`. Autenticado.

### POST /notifications/{id}/read
Marca una notificación como leída (solo si es del usuario). Autenticado.

### POST /notifications/read-all
Marca todas las notificaciones del usuario como leídas. Autenticado.

## Tickets

Ciclo de vida de un ticket: `SUBMITTED → CATEGORIZED → PRIORITIZED → ASSIGNED → (APPROVED si requiere aprobación) → IN_PROGRESS → (ESCALATED) → RESOLVED → CLOSED`

Los estados se agrupan en **`grupoEstado`** (hardcodeado en el backend, lista fija para la UI):

| Grupo | Estados |
|---|---|
| `PENDIENTE` | `SUBMITTED`, `CATEGORIZED`, `PRIORITIZED` |
| `EN_PROCESO` | `ASSIGNED`, `IN_PROGRESS` |
| `EN_APROBACION` | `APPROVED` |
| `EXPIRADO` | `ESCALATED` |
| `RESUELTO` | `RESOLVED`, `CLOSED` |

### Campos del ticket (respuesta)

| Campo | Descripción |
|---|---|
| `id` | UUID del ticket (interno) |
| `codigo` | Código corto visible, ej. `HW-0002`, `IT-0012` — prefijo según categoría + secuencia |
| `email` | Email del solicitante |
| `createdByName` | Nombre del usuario que creó el ticket |
| `title` | Título del ticket (requerido en creación) |
| `category` | Code de la categoría (ej. `IT`, `HARDWARE`, `FINANCE`) |
| `description` | Descripción del problema |
| `priority` | `LOW`, `MEDIUM`, `HIGH`, `URGENT` — al crear sale de `prioridadDefecto` de la categoría (auto-priorización); se puede cambiar con `prioritize` |
| `status` | Estado del ciclo de vida (lista arriba) |
| `grupoEstado` | Grupo del estado para la UI: `PENDIENTE`, `EN_PROCESO`, `EN_APROBACION`, `EXPIRADO` o `RESUELTO` |
| `requiresApproval` | Viene de la categoría (automático) |
| `assignedTo` | UUID del agente asignado (o `null`) |
| `slaDueAt` | Fecha tope según prioridad |
| `resolvedAt` / `closedAt` | Fechas de resolución/cierre (o `null`) |
| `createdAt` / `updatedAt` | Fecha de creación y de última actualización |

> **Formato de fechas:** todos los timestamps se almacenan y devuelven en **UTC** con el sufijo `Z` (ej. `2026-09-15T20:19:44.262Z`). La serialización la maneja Jackson y la JVM corre en UTC (`TimeZone.setDefault("UTC")`), por lo que el cliente (React) debe interpretarlas como UTC y convertirlas a la zona del dispositivo. Esto evita el desfase que se producía al guardar en hora local de Colombia (UTC-5).

### Código corto del ticket

Se genera en el backend en la creación y sigue el patrón `PREFIJO-NNNN` (máx. 2 letras del prefijo + 4 dígitos):

| Categoría | Prefijo | Ejemplo |
|---|---|---|
| `IT` | `IT` | `IT-0001` |
| `ACCESS` | `ACC` | `ACC-0001` |
| `HARDWARE` | `HW` | `HW-0001` |
| `FACILITIES` | `FAC` | `FAC-0001` |
| `FINANCE` | `FIN` | `FIN-0001` |
| `PASSWORD_RECOVERY` | `PR` | `PR-0001` |
| Otras | 2 primeras letras | `MO-0001` |

### SLA según prioridad (desde la priorización)

| Prioridad | Tope |
|---|---|
| `URGENT` | 4 h |
| `HIGH` | 8 h |
| `MEDIUM` | 24 h |
| `LOW` | 72 h |

### POST /tickets
Crea un ticket y lo **auto-clasifica, auto-prioriza y auto-asigna** (ver *Automatizaciones del flujo*). Usa el email del usuario autenticado. `requiresApproval` viene automáticamente de la categoría seleccionada.

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
- `201` con el ticket creado. Según el flujo automático el `status` inicial es `ASSIGNED` (si hay agentes) o `PRIORITIZED` (si no hay); `priority` sale de `prioridadDefecto` de la categoría. Si requiere aprobación, queda en `ASSIGNED` esperando aprobación.

### GET /tickets
Lista tickets con filtros opcionales por query string:
`GET /tickets?status=IN_PROGRESS&category=HARDWARE&priority=HIGH`

**Por defecto devuelve solo los tickets ACTIVOS** (todo menos `RESOLVED`/`CLOSED`). Para traer todos: `GET /tickets?active=false`

Reglas del param `active`:
- No se envía → solo activos.
- `active=false` → todos.
- `active=true` → fuerza solo activos aun pidiendo `status`/`group` de resueltos.
- Si se pide `status` o `group` explícito sin `active` (ej. `group=RESUELTO`), se respeta ese filtro.

**Los filtros son opcionales e independientes** (si no se pasan, aplica el default de activos):

| Query | Resultado |
|---|---|
| `GET /tickets?category=HARDWARE` | Todos los de hardware, sin importar el estado |
| `GET /tickets?status=CLOSED` | Todos los cerrados, sin importar la categoría |
| `GET /tickets?priority=URGENT&status=SUBMITTED` | Solo urgentes en estado SUBMITTED |

**Filtro por grupo de estado** con `group` (para la UI, que solo maneja los 5 grupos):
`GET /tickets?group=EN_PROCESO`
Valores: `PENDIENTE`, `EN_PROCESO`, `EN_APROBACION`, `EXPIRADO`, `RESUELTO`.

**Búsqueda por texto** con `search` (o `q`): busca en código/ID, título, creador y responsable, case-insensitive y con coincidencia parcial:
`GET /tickets?search=1042`, `GET /tickets?search=Juan`, `GET /tickets?search=pantalla&status=IN_PROGRESS&sort=desc`
Si `search=` viene vacío se ignora. Se combina con todos los filtros.

**Ordenamiento** con `sort=asc` o `sort=desc` (por `updatedAt`, para traer siempre los últimos actualizados):
`GET /tickets?sort=desc`

**Paginación opcional** con `limit` y `offset`:
`GET /tickets?limit=10&offset=0`

Cuando se pasa `limit` o `offset`, devuelve `{ total, offset, limit, sort, items }`:
```json
{
  "total": 35,
  "offset": 0,
  "limit": 10,
  "sort": "desc",
  "items": [ { "id": "...", "codigo": "HW-0002", "createdByName": "...", ... } ]
}
```
Sin `limit`/`offset` devuelve el array plano (como antes). `total` es el conteo total después de aplicar `status`/`group`/`category`/`priority`/`search`.

### GET /tickets/meta/groups
Lista los **grupos de estado** con sus estados (para los selects de la UI). Autenticado.
```json
[
  { "name": "PENDIENTE", "label": "Pendiente", "states": ["SUBMITTED", "CATEGORIZED", "PRIORITIZED"] },
  { "name": "EN_PROCESO", "label": "En proceso", "states": ["ASSIGNED", "IN_PROGRESS"] },
  { "name": "EN_APROBACION", "label": "En aprobación", "states": ["APPROVED"] },
  { "name": "EXPIRADO", "label": "Expirado", "states": ["ESCALATED"] },
  { "name": "RESUELTO", "label": "Resuelto", "states": ["RESOLVED", "CLOSED"] }
]
```
El `name` se usa en el filtro `group` de `GET /tickets`.

### GET /tickets/meta/priorities
Lista las **prioridades** (para los selects de la UI). Autenticado.
```json
[
  { "name": "LOW", "label": "Baja" },
  { "name": "MEDIUM", "label": "Media" },
  { "name": "HIGH", "label": "Alta" },
  { "name": "URGENT", "label": "Urgente" }
]
```
El `name` se usa en el filtro `priority` de `GET /tickets` y en `POST /tickets/{id}/prioritize`.

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

### GET /tickets/stats/summary
Resumen del dashboard del admin — tickets activos, próximos a vencer, vencidos y cumplimiento de SLA. **Solo ADMIN y SUPERVISOR** (403 para otros roles). `month` opcional en formato `YYYY-MM` (default: mes actual). Los campos con sufijo `PrevMonth` y los `*Delta` permiten comparar contra el mes anterior.

```json
// respuesta 200
{
  "month": "2026-09",
  "activeTickets": 12,
  "activePrevMonth": 10,
  "activeDelta": 2,
  "nearSlaExpiry": 3,
  "overdueSla": 1,
  "resolved": 9,
  "resolvedPrevMonth": 7,
  "resolvedOnTime": 8,
  "resolvedOnTimePrev": 6,
  "slaCompliance": 88.9,
  "slaCompliancePrev": 85.7,
  "created": 15,
  "createdPrevMonth": 13
}
```

| Campo | Descripción |
|---|---|
| `activeTickets` | Tickets no cerrados ni resueltos (activos hoy) |
| `activePrevMonth` | Activos al cierre del mes anterior |
| `activeDelta` | `activeTickets` − `activePrevMonth` |
| `nearSlaExpiry` | Activos cuyo SLA vence dentro de las próximas 12 h |
| `overdueSla` | Activos ya vencidos (SLA pasado, sin resolver) |
| `resolvedOnTime` | Resueltos a tiempo en el mes |
| `slaCompliance` | `resolvedOnTime / resolved × 100`, máx. 2 decimales |
| `slaCompliancePrev` | Idem para mes anterior |
| `created` / `createdPrevMonth` | Creados en el mes actual / anterior |

---

## Base de Conocimiento (Auto-Servicio)

Artículos para la sección "Base de Conocimiento & Auto-Servicio": tarjetas con categoría, contador de lecturas, título y descripción.

### Campos del artículo (respuesta)

| Campo | Descripción |
|---|---|
| `id` | UUID del artículo |
| `titulo` | Título del artículo |
| `descripcion` | Descripción corta (para la tarjeta) |
| `contenido` | Texto completo del artículo |
| `categoria` | Code de la categoría (ej. `IT`, `ACCESS`, `FINANCE`, `FACILITIES`) |
| `visualizaciones` | Contador de lecturas/vistas |
| `megusta` | Votos positivos (útil) |
| `nomegusta` | Votos negativos (no útil) |
| `satisfaccion` | Porcentaje de satisfacción (`megusta / (megusta + nomegusta) * 100`) |
| `tiempoLecturaMin` | Tiempo estimado de lectura en minutos (basado en ~200 palabras/min) |
| `activo` | Si está publicado (`true`) o desactivado (`false`) |
| `actualizadoEn` | Fecha de última actualización (UTC) |

### GET /knowledge
Lista los artículos **activos** (los desactivados quedan ocultos) ordenados por más reciente. **Público** (sin login).

```json
[
  {
    "id": "11111111-...",
    "titulo": "Cómo conectar y configurar la VPN corporativa GlobalProtect",
    "descripcion": "Guía paso a paso para autenticación multifactor...",
    "categoria": "IT",
    "visualizaciones": 1402,
    "activo": true
  }
]
```

### GET /knowledge/{id}
Trae un artículo por ID (con su `contenido`). **Público**. `404` si no existe.
### POST /knowledge/{id}/view

Incrementa en 1 las `visualizaciones` del artículo. **Público** y sin CSRF (es un contador de clics). Devuelve:

```json
{ "id": "11111111-...", "visualizaciones": 1403 }
```

### POST /knowledge/{id}/votar

Registra un voto de satisfacción (útil / no útil) en el artículo. **Público** y sin CSRF. Body: `{ "megusta": true|false }` (`true` = útil, `false` = no útil). Devuelve el resumen actualizado:

```json
// respuesta 200
{
  "id": "11111111-...",
  "megusta": 42,
  "nomegusta": 3,
  "satisfaccion": 93.33,
  "tiempoLecturaMin": 5
}
```

- `404` si el artículo no existe.

### POST /knowledge
Crea un artículo. **Solo ADMIN** (403 para otros roles). Requiere CSRF. Body: `{ "titulo", "descripcion", "contenido", "categoria" }`. `201` con el artículo creado.

### PUT /knowledge/{id}
Edita un artículo (títulos, descripción, contenido, categoría o `activo`). **Solo ADMIN**. Body: `{ "titulo", "descripcion", "contenido", "categoria", "activo" }` (todos opcionales, parcialmente). `200` con el artículo actualizado. `404` si no existe.

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
12. `GET /tickets/stats/monthly?month=2026-09` → estadísticas mensuales.
13. `GET /tickets/stats/summary?month=2026-09` → resumen SLA + activos (solo ADMIN/SUPERVISOR).
14. `GET /tickets?limit=10&offset=0&sort=desc` → página de tickets con `total`, ordenados por última actualización.
15. `GET /knowledge` → artículos publicados (público).
16. `POST /knowledge/{id}/view` → incrementa lecturas al hacer click (público, sin CSRF).
17. `POST /knowledge` y `PUT /knowledge/{id}` (ADMIN, con CSRF) → crear/editar artículos.