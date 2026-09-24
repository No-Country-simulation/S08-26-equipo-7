# Tickets — Visión General

Ciclo de vida de un ticket:

`SUBMITTED → CATEGORIZED → PRIORITIZED → ASSIGNED → (PENDING_APPROVAL → IN_PROGRESS directo al aprobar, si requiere aprobación) → IN_PROGRESS → (ESCALATED) → RESOLVED → CLOSED`

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
| `priority` | `LOW`, `MEDIUM`, `HIGH`, `URGENT` — al crear sale de `prioridadDefecto` de la categoría (auto-priorización); se puede cambiar con `prioritize` |
| `status` | Estado del ciclo de vida (lista arriba) |
| `grupoEstado` | Grupo del estado para la UI: `PENDIENTE`, `EN_PROCESO`, `EN_APROBACION`, `EXPIRADO` o `RESUELTO` |
| `requiresApproval` | Viene de la categoría (automático) |
| `assignedTo` | UUID del agente asignado (o `null`) |
| `assignedToName` | Nombre del agente asignado (o `null`) |
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

## POST /tickets

Crea un ticket y lo **auto-clasifica, auto-prioriza y auto-asigna** (ver [Automatizaciones](04-tickets-automatizaciones.md)). Usa el email del usuario autenticado. `requiresApproval` viene automáticamente de la categoría seleccionada.

```json
// body
{
  "title": "No enciende mi notebook",
  "description": "No arranca el equipo al presionar el botón de encendido",
  "category": "HARDWARE"
}
```

- `title`, `description` y `category` son **requeridos** (400 si falta alguno)
- **Límites de longitud:** `title` máx 180, `description` máx 1000 (si se supera, devuelve 400 con `@Size`)
- `409` si la categoría no existe o está inactiva
- `201` con el ticket creado. Por el flujo automático el `status` inicial es `ASSIGNED` (si hay agentes) o `PRIORITIZED` (si no); `priority` sale de `prioridadDefecto` de la categoría. Si requiere aprobación, queda en `ASSIGNED` esperando aprobación.

## GET /tickets

Lista tickets con filtros opcionales por query string:

```
GET /tickets?status=IN_PROGRESS&category=HARDWARE&priority=HIGH
```

**Alcance por rol** (según el token, sin parámetros extra): `REQUESTER` solo los que creó, `AGENT` solo los asignados, `SUPERVISOR` solo los de su área (sin área ve todo), `ADMIN` ve todo.

**Por defecto devuelve solo los tickets ACTIVOS** (todo menos `RESOLVED` y `CLOSED`), para que el listado no se llene de resueltos. Para traer todos se pasa `active=false`:

```
GET /tickets            // solo activos
GET /tickets?active=false   // todos, incluidos resueltos y cerrados
```

Reglas del param `active`:

- No se envía → solo activos.
- `active=false` → todos.
- `active=true` → fuerza solo activos aunque se pidan `status`/`group` de resueltos.
- Si el request pide explícitamente un `status` o `group` (ej. `group=RESUELTO`) sin `active`, se respeta ese filtro (devuelve los resueltos pedidos): el "solo activos" por defecto aplica a la consulta general sin filtros de estado.

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

## Transiciones (todas `POST`)

Ver [Transiciones](04-tickets-transiciones.md) para la tabla completa con roles y validaciones.

## Documentación relacionada

- [Automatizaciones del flujo](04-tickets-automatizaciones.md) — SLA, auto-cierre, auto-asignación, vencimiento
- [Línea de tiempo (timeline)](04-tickets-timeline.md) — Historial de eventos del ticket
- [Transiciones](04-tickets-transiciones.md) — Endpoints POST de transición de estado
- [Estadísticas](05-tickets-estadisticas.md) — Métricas mensuales y resumen
- [Mensajes y notificaciones](08-notificaciones-y-mensajes.md) — Hilo de mensajes y notificaciones in-app