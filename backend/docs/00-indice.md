# API ServiceFlow — Índice

Base URL: `http://localhost:8080/api/v1`

Todas las respuestas son JSON. Los errores siguen el formato `{"error": "mensaje"}`.

## Seguridad (resumen)

- Login JWT en **cookie HttpOnly** (`access_token`).
- Los POST que modifican datos requieren header **`X-XSRF-TOKEN`** con el valor de la cookie `XSRF-TOKEN`.
- **Antes de escribir**, pedir el token al servidor: `GET /auth/csrf` → guarda la cookie `XSRF-TOKEN` y devuelve el token en el body. Usar ese mismo valor en el header.

## Errores

| Código | Significado |
|---|---|
| `401` | No autenticado — falta la cookie `access_token` |
| `403` | Autenticado pero sin permiso (rol insuficiente o falta CSRF) |
| `404` | Recurso no encontrado |
| `409` | Conflicto — email duplicado, categoría duplicada, transición inválida |
| `422` | Error de validación — campos requeridos, formato inválido, contraseña débil |
| `429` | Rate limit (recover-password: máx. 3 / 15 min por IP) |

## Roles

| Rol | Qué puede hacer |
|---|---|
| `REQUESTER` | Crear tickets y cerrar los suyos |
| `AGENT` | Categorizar, priorizar, atender, escalar, resolver |
| `SUPERVISOR` | Asignar, aprobar, escalar, cerrar |
| `ADMIN` | Todo + crear usuarios + gestionar categorías |

## Módulos

| Archivo | Contenido |
|---|---|
| [01-auth.md](01-auth.md) | `POST /auth/login`, `GET /auth/csrf`, `POST /auth/recover-password`, `GET /auth/me`, `POST /auth/logout` |
| [02-categorias.md](02-categorias.md) | `GET /categories`, `GET /categories/all`, `PUT /categories/{id}`, `POST /categories/{id}/toggle` |
| [03-usuarios.md](03-usuarios.md) | `POST /users`, `GET /users` |
| [04-tickets.md](04-tickets.md) | Campos, código corto, SLA, `POST /tickets`, `GET /tickets` (filtros/sort/paginación/búsqueda/group), `GET /tickets/meta/groups`, `GET /tickets/meta/priorities`, `GET /tickets/{id}`, transiciones |
| [05-tickets-estadisticas.md](05-tickets-estadisticas.md) | `GET /tickets/stats/monthly`, `GET /tickets/stats/summary` |
| [06-base-conocimiento.md](06-base-conocimiento.md) | `GET /knowledge`, `GET /knowledge/{id}`, `POST /knowledge/{id}/view`, `POST /knowledge`, `PUT /knowledge/{id}` |
| [07-flujo-csrf.md](07-flujo-csrf.md) | Ejemplo completo: login → csrf → crear/transicionar ticket con CSRF |