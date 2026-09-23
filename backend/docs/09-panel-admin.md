# Panel de Administración (solo ADMIN)

Todo lo que solo el `ADMIN` puede hacer, en un solo lugar. Todos requieren autenticación (cookie `access_token`); los `POST/PUT/DELETE` además requieren CSRF (`X-XSRF-TOKEN`).

## Usuarios

| Endpoint | Descripción |
|---|---|
| `POST /users` | Crear usuario. Body `{ "name", "email", "role", "password", "area" }` (`area` opcional; los `REQUESTER` no la necesitan) |
| `GET /users` | Listar todos (con `area`, nunca trae contraseña) |
| `GET /users/agents?search=&area=` | Buscador de agentes para reasignar (autocompletar). `search` filtra por nombre/email, `area` por área. **ADMIN y SUPERVISOR** |
| `POST /users/{id}/password` | El admin cambia la contraseña de cualquier usuario. Body `{ "newPassword" }` (mínimo 8) |
| `POST /users/me/password` | Cada usuario cambia su propia contraseña. Body `{ "currentPassword", "newPassword" }` (cualquier rol autenticado) |

## Recuperar contraseña (flujo público)

`POST /auth/recover-password` con `{ "email" }` — **público** (sin token), siempre devuelve `200` (no revela si el email existe) y crea un ticket interno de recuperación solo si el email existe. Rate limit: máx 3 / 15 min por IP (`429` si se pasa).

## Tickets (acciones de admin)

| Endpoint | Descripción |
|---|---|
| `POST /tickets/{id}/approve` | Aprobar (**solo ADMIN**). Pasa directo a `IN_PROGRESS` |
| `POST /tickets/{id}/reassign?assignedTo={UUID}` | Reasignar a otro agente (ADMIN y SUPERVISOR), desde cualquier estado activo |
| `POST /tickets/{id}/set-status?status={ESTADO}` | Cambio libre de estado. ADMIN: `SUBMITTED`, `CATEGORIZED`, `PRIORITIZED`, `ASSIGNED`, `PENDING_APPROVAL`, `APPROVED`, `IN_PROGRESS`, `ESCALATED`, `RESOLVED` (nunca `CLOSED`, es terminal) |
| `POST /tickets/{id}/categorize?category={CODE}` | Cambiar el área del ticket (**solo ADMIN**), sincroniza `requiresApproval` |
| `POST /tickets/{id}/reopen` | Reabrir un `CLOSED` → vuelve a `ASSIGNED` con SLA reiniciado (ADMIN y SUPERVISOR) |
| `GET /tickets/stats/summary` | Métricas del dashboard (ADMIN y SUPERVISOR) |

## Categorías y conocimiento

| Endpoint | Descripción |
|---|---|
| `GET /categories/all`, `POST /categories`, `PUT /categories/{id}` | Gestión de categorías (**solo ADMIN**; el listado público es `GET /categories`) |
| `POST /knowledge`, `PUT /knowledge/{id}` | Crear/editar artículos (**solo ADMIN**) |

## Usuarios demo (para probar)

| Email | Password | Rol |
|---|---|---|
| `admin@serviceflow.com` | `admin123` | ADMIN |
| `agente@serviceflow.com` | `agente123` | AGENT |
| `solicitante@serviceflow.com` | `solicitante123` | REQUESTER |
| `supervisor@serviceflow.com` | `supervisor123` | SUPERVISOR |
