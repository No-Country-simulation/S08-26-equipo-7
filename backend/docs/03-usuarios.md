# Usuarios

Todos los endpoints requieren **solo ADMIN**.

## POST /users

Crea un usuario.

```json
// body
{ "name": "Mariana López", "email": "mariana.lopez@empresa.com", "role": "AGENT", "password": "ClaveSegura1" }
```

```json
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

## GET /users

Lista todos los usuarios. La respuesta **nunca incluye** `passwordHash`.

```json
// respuesta 200
[ { "id": "uuid", "name": "Mariana López", "email": "mariana.lopez@empresa.com", "role": "AGENT", "createdAt": "2026-09-14T09:21:17" } ]
```