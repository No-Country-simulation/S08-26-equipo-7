# Automatizaciones del Flujo de Tickets

Al **crear** un ticket el backend automatiza lo máximo posible (el ticket no depende de gestión humana salvo que realmente la necesite):

## Flujo automático al crear ticket

1. **Auto-clasifica** (`CATEGORIZED`) con la categoría enviada.
2. **Auto-prioriza** (`PRIORITIZED`) con la prioridad por defecto de la categoría (`prioridad_defecto`) y calcula el SLA.
3. **Auto-asigna** (`ASSIGNED`) al agente (`role=AGENT`) **del área del ticket con menos tickets activos**. Si no hay agentes de esa área, cae al general. Si no hay agentes, queda en `PRIORITIZED`.
4. Si la categoría **requiere aprobación**, pasa el ticket a `PENDING_APPROVAL` (grupo `EN_APROBACION`), registra `APPROVAL_REQUIRED` ("Requiere autorización gerencial obligatoria") y notifica a supervisores/admin.
5. Notifica al agente asignado (`TICKET_ASIGNADO`).

Cada paso queda en la línea de tiempo con `actorNombre = "Sistema"`.

---

## Vencimiento automático del SLA (EXPIRADO)

Un **scheduler en el backend** revisa los tickets cada 60 segundos (configurable con la env var `SLA_EXPIRY_CHECK_MS`, default `60000`):

- Si un ticket **activo** (cualquier estado excepto `RESOLVED`/`CLOSED`/`ESCALATED`) tiene `slaDueAt` **ya vencido**, el sistema lo cambia **automáticamente** a `ESCALATED` (grupo `EXPIRADO`).
- Se actualiza también su `updatedAt`.
- No se tocan tickets ya `ESCALATED`, `RESOLVED` o `CLOSED`.
- Se **notifica** al solicitante, al agente asignado y a los supervisores (`SLA_VENCIDO`).

El ticket vencido aparece de inmediato en `GET /tickets?group=EXPIRADO` y en el contador `overdueSla` del resumen. Además registra un evento `ESCALATED` ("Ticket expirado por SLA vencido") en su línea de tiempo.

---

## Auto-cierre de resueltos inactivos

Un **scheduler** cierra solos los tickets `RESOLVED` que llevan más de `48 h` sin actividad (env var `AUTO_CLOSE_RESOLVED_HOURS`, default `48`; revisión cada `AUTO_CLOSE_CHECK_MS`, default `300000`):

- Pasa el ticket a `CLOSED`, registra el evento `CLOSED` ("Ticket cerrado automáticamente por inactividad tras resolución", actor `"Sistema (auto-cierre)"`) y notifica al solicitante.

---

## Prioridad por defecto por categoría

Cada categoría tiene `prioridadDefecto` (`LOW`, `MEDIUM`, `HIGH`, `URGENT`, default `MEDIUM`) que se usa al auto-priorizar. Se administra desde `POST/PUT /categories` (campo `prioridadDefecto`) y viene en `GET /categories`.

---

## SLA según prioridad (desde la priorización)

| Prioridad | Tope |
|---|---|
| `URGENT` | 4 h |
| `HIGH` | 8 h |
| `MEDIUM` | 24 h |
| `LOW` | 72 h |

---

## Configuración via Environment Variables

| Variable | Default | Descripción |
|---|---|---|
| `SLA_EXPIRY_CHECK_MS` | `60000` | Intervalo del scheduler de vencimiento SLA (ms) |
| `AUTO_CLOSE_RESOLVED_HOURS` | `48` | Horas de inactividad para auto-cerrar resueltos |
| `AUTO_CLOSE_CHECK_MS` | `300000` | Intervalo del scheduler de auto-cierre (ms) |