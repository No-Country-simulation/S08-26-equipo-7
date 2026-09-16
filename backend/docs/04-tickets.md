# Tickets

Ciclo de vida de un ticket: `SUBMITTED → CATEGORIZED → PRIORITIZED → ASSIGNED → (APPROVED si requiere aprobación) → IN_PROGRESS → (ESCALATED) → RESOLVED → CLOSED`

Los estados se agrupan en **`grupoEstado`** (hardcodeado en el backend, lista fija para la UI):

| Grupo | Estados |
|---|---|
| `PENDIENTE` | `SUBMITTED`, `CATEGORIZED`, `PRIORITIZED` |
| `EN_PROCESO` | `ASSIGNED`, `IN_PROGRESS` |
| `EN_APROBACION` | `APPROVED` |
| `EXPIRADO` | `ESCALATED` |
| `RESUELTO` | `RESOLVED`, `CLOSED` |

## Campos del ticket (respuesta)

| Campo | Descripción |
|---|---|
| `id` | UUID del ticket (interno) |
| `codigo` | Código corto visible, ej. `HW-0002`, `IT-0012` — prefijo según categoría + secuencia |
| `email` | Email del solicitante |
| `createdByName` | Nombre del usuario que creó el ticket |
| `title` | Título del ticket (requerido en creación) |
| `category` | Code de la categoría (ej. `IT`, `HARDWARE`, `FINANCE`) |
| `description` | Descripción del problema |
| `priority` | `LOW`, `MEDIUM`, `HIGH`, `URGENT` — fijada en `MEDIUM` al crear; solo el supervisor la cambia vía `prioritize` |
| `status` | Estado del ciclo de vida (lista arriba) |
| `grupoEstado` | Grupo del estado para la UI: `PENDIENTE`, `EN_PROCESO`, `EN_APROBACION`, `EXPIRADO` o `RESUELTO` |
| `requiresApproval` | Viene de la categoría (automático) |
| `assignedTo` | UUID del agente asignado (o `null`) |
| `slaDueAt` | Fecha tope según prioridad |
| `resolvedAt` / `closedAt` | Fechas de resolución/cierre (o `null`) |
| `createdAt` / `updatedAt` | Fecha de creación y de última actualización |

> **Formato de fechas:** todos los timestamps se almacenan y devuelven en **UTC** con el sufijo `Z` (ej. `2026-09-15T20:19:44.262Z`). La serialización la maneja Jackson y la JVM corre en UTC (`TimeZone.setDefault("UTC")`), por lo que el cliente (React) debe interpretarlas como UTC y convertirlas a la zona del dispositivo.

## Código corto del ticket

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

## SLA según prioridad (desde la priorización)

| Prioridad | Tope |
|---|---|
| `URGENT` | 4 h |
| `HIGH` | 8 h |
| `MEDIUM` | 24 h |
| `LOW` | 72 h |

## Vencimiento automático del SLA (EXPIRADO)

Un **scheduler en el backend** revisa los tickets cada 60 segundos (configurable con la env var `SLA_EXPIRY_CHECK_MS`, default `60000`):

- Si un ticket **activo** (cualquier estado excepto `RESOLVED`/`CLOSED`) tiene `slaDueAt` **ya vencido**, el sistema lo cambia **automáticamente** a `ESCALATED` (grupo `EXPIRADO`).
- Se actualiza también su `updatedAt`.
- No se tocan tickets ya `ESCALATED`, `RESOLVED` o `CLOSED`.

El ticket vencido aparece de inmediato en `GET /tickets?group=EXPIRADO` y en el contador `overdueSla` del resumen.

## POST /tickets

Crea un ticket como `SUBMITTED`. Usa el email del usuario autenticado. **La prioridad siempre es `MEDIUM`** (seteada en el backend, no enviada desde el front). `requiresApproval` viene automáticamente de la categoría seleccionada.

```json
// body
{
  "title": "No enciende mi notebook",
  "description": "No arranca el equipo al presionar el botón de encendido",
  "category": "HARDWARE"
}
```

- `title`, `description` y `category` son **requeridos** (400 si falta alguno)
- `409` si la categoría no existe o está inactiva
- `201` respuesta con el ticket creado (`priority: "MEDIUM"`, `requiresApproval` según categoría)

## GET /tickets

Lista tickets con filtros opcionales por query string:

```
GET /tickets?status=IN_PROGRESS&category=HARDWARE&priority=HIGH
```

**Los filtros devuelven todo si no se pasan** (son opcionales e independientes). Ejemplos:

| Query | Resultado |
|---|---|
| `GET /tickets?category=HARDWARE` | Todos los de hardware, sin importar el estado |
| `GET /tickets?status=CLOSED` | Todos los cerrados, sin importar la categoría |
| `GET /tickets?priority=URGENT&status=SUBMITTED` | Solo urgentes en estado SUBMITTED |

**Filtro por grupo de estado** con `group` (para la UI, que solo maneja los 5 grupos):

```
GET /tickets?group=EN_PROCESO
```

Valores: `PENDIENTE`, `EN_PROCESO`, `EN_APROBACION`, `EXPIRADO`, `RESUELTO`.

**Búsqueda por texto** con `search` (o `q`): busca en código/ID, título, creador y responsable, sin distinguir mayúsculas y con coincidencia parcial:

```
GET /tickets?search=1042        // por código o ID
GET /tickets?search=Juan        // por creador o responsable
GET /tickets?search=pantalla&status=IN_PROGRESS&sort=desc   // combina con los filtros
```

Si `search=` viene vacío se ignora y devuelve la lista normal. Se combina con `status`, `group`, `category`, `priority`, `sort`, `limit` y `offset`.

**Ordenamiento** con `sort=asc` o `sort=desc` (por `updatedAt`, para traer siempre los últimos actualizados):

```
GET /tickets?sort=desc
```

**Paginación opcional** con `limit` y `offset`:

```
GET /tickets?limit=10&offset=0
```

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

Sin `limit`/`offset` devuelve el array plano (como antes). `total` es el conteo total después de aplicar `status`/`category`/`priority`.

## GET /tickets/{id}

Devuelve un ticket por UUID. `404` si no existe.

## GET /tickets/meta/groups

Lista los **grupos de estado** con sus estados (para los select de la UI). Autenticado.

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

## GET /tickets/meta/priorities

Lista las **prioridades** (para los select de la UI). Autenticado.

```json
[
  { "name": "LOW", "label": "Baja" },
  { "name": "MEDIUM", "label": "Media" },
  { "name": "HIGH", "label": "Alta" },
  { "name": "URGENT", "label": "Urgente" }
]
```

El `name` se usa en el filtro `priority` de `GET /tickets` y en `POST /tickets/{id}/prioritize`.

## Transiciones (todas `POST`)

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

- `200` con el ticket actualizado
- `404` si no existe
- `409` si la transición no es válida para el estado actual o el rol no lo permite
- `403` si falta el token CSRF