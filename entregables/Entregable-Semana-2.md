# Entregable — Semana 2

**Proyecto:** ServiceFlow — Sistema de gestión de tickets (mesa de ayuda)
**Equipo:** S08-26 Equipo 7
**Sprint:** Semana 2 — Ejecución y Colaboración
**Fecha:** jueves 17 de septiembre de 2026
**Área:** Backend (Spring Boot + PostgreSQL)
**Rama:** `feature/tickets-sla` → mergeada a `backend`

---

## 1. Resumen del sprint

En este sprint se completó el **flujo automático de tickets**, la **trazabilidad por línea de tiempo**, el **sistema de mensajes/comentarios** y el **sistema de notificaciones in-app** del backend. El objetivo fue que un ticket avance solo todo lo que se pueda, y que quede registro de cada acción (humana o del sistema).

Todo el trabajo está mergeado en la rama `backend` (PR #54, #55, #57, #58), documentado y con pruebas pasando.

---

## 2. Funcionalidades entregadas

### 2.1. Línea de tiempo del ticket (trazabilidad)
- Se registra un evento por cada acción del ticket en la tabla `ticket_eventos`.
- Endpoint: `GET /api/v1/tickets/{id}/timeline` (orden cronológico).
- Eventos: `CREATED`, `CATEGORIZED`, `PRIORITIZED`, `ASSIGNED`, `APPROVAL_REQUIRED`, `APPROVED`, `STARTED`, `ESCALATED`, `RESOLVED`, `CLOSED` y `MESSAGE`.
- Cada evento guarda tipo, descripción, actor (email/nombre) y fecha. Las acciones automáticas quedan como `"Sistema"`, `"Sistema (SLA)"` o `"Sistema (auto-cierre)"`.

### 2.2. Automatizaciones del flujo
Al **crear** un ticket el backend:
1. **Auto-clasifica** con la categoría seleccionada.
2. **Auto-prioriza** con la prioridad por defecto de la categoría y calcula el SLA.
3. **Auto-asigna** al agente (rol `AGENT`) con menos tickets activos. Si no hay agentes, queda en `PRIORITIZED`.
4. Si la categoría **requiere aprobación**, registra `APPROVAL_REQUIRED` y notifica a supervisores/admin (la aprobación la hace una persona).
5. Notifica al agente asignado.

Además:
- **Vencimiento de SLA:** un scheduler revisa los tickets activos y, si se venció el SLA, los pasa a `ESCALATED` (grupo `EXPIRADO`), registra el evento y notifica (solicitante, agente y supervisores).
- **Auto-cierre:** un scheduler cierra automáticamente los tickets `RESOLVED` con más de 48 h sin actividad y notifica al solicitante.

### 2.3. Mensajes / comentarios del ticket
- Hilo de comentarios separado de la línea de tiempo.
- Endpoints:
  - `GET /api/v1/tickets/{id}/messages`
  - `POST /api/v1/tickets/{id}/messages` → body `{ "message": "..." }`
- Cada mensaje deja un evento `MESSAGE` en la línea de tiempo y **notifica a la contraparte**: si comenta el solicitante avisa al agente asignado; si comenta otro, avisa al solicitante.

### 2.4. Notificaciones in-app
- Se generan automáticamente en: asignación, aprobación requerida, aprobación, resolución, cierre, escalado, vencimiento de SLA y mensaje nuevo.
- Endpoints:
  - `GET /api/v1/notifications` (lista + contador de no leídas)
  - `GET /api/v1/notifications/unread-count`
  - `POST /api/v1/notifications/{id}/read`
  - `POST /api/v1/notifications/read-all`

### 2.5. Mejoras adicionales
- Cada categoría tiene **prioridad por defecto** (`categorias.prioridad_defecto`).
- `GET /api/v1/tickets` devuelve **solo activos por defecto** (nuevo parámetro `active=false` para traer todos).

---

## 3. Endpoints nuevos del sprint

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/v1/tickets/{id}/timeline` | Historial/trazabilidad del ticket |
| `GET` | `/api/v1/tickets/{id}/messages` | Lista los mensajes del ticket |
| `POST` | `/api/v1/tickets/{id}/messages` | Agrega un mensaje al ticket |
| `GET` | `/api/v1/notifications` | Notificaciones del usuario + no leídas |
| `GET` | `/api/v1/notifications/unread-count` | Contador de no leídas |
| `POST` | `/api/v1/notifications/{id}/read` | Marca una notificación como leída |
| `POST` | `/api/v1/notifications/read-all` | Marca todas como leídas |

> Todos requieren autenticación (cookie JWT) y los `POST` requieren CSRF (`GET /auth/csrf` + header `X-XSRF-TOKEN`).

---

## 4. Base de datos

Migración **Flyway V12** (`V12__mensajes_y_notificaciones.sql`):
- Tabla `ticket_mensajes`.
- Tabla `notificaciones`.
- Columna `categorias.prioridad_defecto`.
- Seeds de prioridad por defecto (ej. `HARDWARE`/`ACCESS` = `HIGH`, `PASSWORD_RECOVERY` = `URGENT`).

Migraciones previas relevantes: `ticket_eventos` (línea de tiempo) y el esquema base de tickets/usuarios/categorías.

---

## 5. Cómo ejecutar

### Con Docker Compose (recomendado)
```bash
# definir variables en .env (ver .env.example)
docker compose up --build
```
- API: `http://localhost:8080/api/v1`
- PostgreSQL: puerto host `5433` por defecto

### Local (backend)
```bash
cd backend
./mvnw spring-boot:run
```

### Variables de entorno principales
| Variable | Descripción | Default |
|---|---|---|
| `DB_URL` | URL JDBC de PostgreSQL | `jdbc:postgresql://localhost:5432/serviceflow_db` |
| `DB_USERNAME` | Usuario de BD | `postgres` |
| `DB_PASSWORD` | Contraseña de BD | — |
| `ADMIN_PASSWORD_HASH` | Hash del admin inicial | — |
| `JWT_SECRET` | Clave de firma JWT | — |
| `JWT_EXPIRATION_MS` | Expiración del token | `86400000` |
| `SLA_EXPIRY_CHECK_MS` | Frecuencia del chequeo de SLA | `60000` |
| `AUTO_CLOSE_CHECK_MS` | Frecuencia del auto-cierre | `300000` |
| `AUTO_CLOSE_RESOLVED_HOURS` | Horas para auto-cerrar un resuelto | `48` |

---

## 6. Pruebas y evidencia

- **Tests automáticos:** `./mvnw test` → **5/5 OK** (`CsrfContextTests`, `ServiceflowApiApplicationTests`).
- **Pruebas funcionales en vivo** (backend + PostgreSQL):
  - Creación de ticket → auto-clasificado, auto-priorizado (`HIGH`) y auto-asignado, con eventos `CREATED`/`CATEGORIZED`/`PRIORITIZED`/`ASSIGNED`/`APPROVAL_REQUIRED`.
  - Mensaje en el ticket → evento `MESSAGE` y notificación `TICKET_MENSAJE` al agente asignado.
  - Flujo completo: `start` → `resolve` → **auto-cierre** a `CLOSED` por inactividad.
  - Notificaciones generadas y contador de no leídas verificado.

---

## 7. Documentación

- `backend/API.md` — referencia completa de la API.
- `backend/docs/00-indice.md` — índice.
- `backend/docs/04-tickets.md` — tickets, timeline, mensajes y automatizaciones.
- `backend/docs/08-notificaciones-y-mensajes.md` — notificaciones y mensajes.
- `postman/ServiceFlow_API.postman_collection.json` — colección con todos los endpoints.

---

## 8. Pendientes / próximos pasos

- Frontend: integrar los endpoints nuevos y ajustar la UI al `status` inicial `ASSIGNED` (antes `SUBMITTED`) y a los tipos nuevos (`APPROVAL_REQUIRED`, `MESSAGE`, `TICKET_MENSAJE`).
- Mejoras opcionales acordadas con el PO para siguientes sprints:
  - Trato especial de auto-asignación para urgencias (agente con menos urgencias activas + aviso a supervisores) — revisión pendiente del PO.
  - Notificar al solicitante cuando le asignan el ticket o cuando inician el trabajo.
