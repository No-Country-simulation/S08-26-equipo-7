# Usuarios

Todos los endpoints requieren **solo ADMIN**.

## Usuarios demo (para probar el login)

| Email | Password | Rol |
|---|---|---|
| `admin@serviceflow.com` | `admin123` | ADMIN |
| `agente@serviceflow.com` | `agente123` | AGENT |
| `solicitante@serviceflow.com` | `solicitante123` | REQUESTER |
| `supervisor@serviceflow.com` | `supervisor123` | SUPERVISOR |
| `ana.agent@demo.com` (y demás `@demo.com`) | `demo123` | varios |

## POST /users

Crea un usuario.

```json
// body (area opcional; los REQUESTER no la necesitan)
{ "name": "Mariana López", "email": "mariana.lopez@empresa.com", "role": "AGENT", "password": "ClaveSegura1", "area": "HARDWARE" }
```

```json
// respuesta 201 — NUNCA devuelve la contraseña
{ "id": "uuid", "name": "Mariana López", "email": "mariana.lopez@empresa.com", "role": "AGENT", "area": "HARDWARE", "createdAt": "2026-09-14T09:21:17" }
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

## GET /users

Lista todos los usuarios. La respuesta **nunca incluye** `passwordHash`.

```json
// respuesta 200
[ { "id": "uuid", "name": "Mariana López", "email": "mariana.lopez@empresa.com", "role": "AGENT", "area": "HARDWARE", "createdAt": "2026-09-14T09:21:17" } ]
```

## GET /users/agents?search=&area=

Buscador de agentes para reasignar (autocompletar). **Solo ADMIN y SUPERVISOR**. Parámetros opcionales: `search` (filtra por nombre o email) y `area` (filtra por área, ej. `HARDWARE`). Devuelve la lista de agentes (con `area`).

## POST /users/me/password

Cambia la contraseña del propio usuario autenticado. Body `{ "currentPassword": "...", "newPassword": "..." }` (mínimo 8 caracteres). `422` si la actual no coincide o la nueva es muy corta.