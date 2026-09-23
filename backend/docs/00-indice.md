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

## 📚 Documentación por Módulo

### 🔐 Autenticación y Seguridad
| Archivo | Contenido |
|---|---|
| [01-auth.md](01-auth.md) | `POST /auth/login`, `GET /auth/csrf`, `POST /auth/recover-password`, `GET /auth/me`, `POST /auth/logout` |
| [07-flujo-csrf.md](07-flujo-csrf.md) | Ejemplo completo: login → csrf → crear/transicionar ticket con CSRF |

### 🎫 Tickets (Módulo Principal)
| Archivo | Contenido |
|---|---|
| [04-tickets.md](04-tickets.md) | **Visión general**: campos, código corto, SLA, `POST /tickets`, `GET /tickets` (filtros/sort/paginación/búsqueda/group), `GET /tickets/{id}` |
| [04-tickets-automatizaciones.md](04-tickets-automatizaciones.md) | Automatizaciones: auto-clasificar, auto-priorizar, auto-asignar, SLA, auto-cierre, vencimiento |
| [04-tickets-transiciones.md](04-tickets-transiciones.md) | Transiciones de estado (POST): categorize, prioritize, assign, approve, start, escalate, resolve, close |
| [04-tickets-timeline.md](04-tickets-timeline.md) | Línea de tiempo: `GET /tickets/{id}/timeline`, tipos de evento, actores |

### 📊 Estadísticas y Métricas
| Archivo | Contenido |
|---|---|
| [05-tickets-estadisticas.md](05-tickets-estadisticas.md) | `GET /tickets/stats/monthly`, `GET /tickets/stats/summary` (SLA compliance corregido) |

### 📚 Base de Conocimiento (Auto-Servicio)
| Archivo | Contenido |
|---|---|
| [06-base-conocimiento.md](06-base-conocimiento.md) | `GET /knowledge`, `GET /knowledge/{id}`, `POST /knowledge/{id}/view`, `POST /knowledge`, `PUT /knowledge/{id}`, **votación**: `POST /knowledge/{id}/votar`, `GET /knowledge/{id}/mi-voto`, `DELETE /knowledge/{id}/votar` |

### 🔔 Notificaciones y Mensajes
| Archivo | Contenido |
|---|---|
| [08-notificaciones-y-mensajes.md](08-notificaciones-y-mensajes.md) | Notificaciones in-app (`GET /notifications`, marcar leídas), mensajes/comentarios del ticket (`GET/POST /tickets/{id}/messages`) |

### 🛡️ Panel de Administración (solo ADMIN)
| Archivo | Contenido |
|---|---|
| [09-panel-admin.md](09-panel-admin.md) | Todo lo solo-admin en un lugar: usuarios (crear, áreas, buscador agentes, contraseñas), recover-password, acciones de tickets, categorías, conocimiento, usuarios demo |

### 👥 Usuarios y Categorías
| Archivo | Contenido |
|---|---|
| [02-categorias.md](02-categorias.md) | `GET /categories`, `GET /categories/all`, `PUT /categories/{id}`, `POST /categories/{id}/toggle` |
| [03-usuarios.md](03-usuarios.md) | `POST /users`, `GET /users` |

---

## 🔍 Guía Rápida de Búsqueda

| ¿Qué buscas? | Archivo |
|---|---|
| Login, logout, CSRF, recover password | [01-auth.md](01-auth.md) |
| Flujo completo con CSRF | [07-flujo-csrf.md](07-flujo-csrf.md) |
| Crear/listar tickets, filtros, paginación | [04-tickets.md](04-tickets.md) |
| Transiciones de estado (categorize, resolve, close, etc.) | [04-tickets-transiciones.md](04-tickets-transiciones.md) |
| Línea de tiempo / historial | [04-tickets-timeline.md](04-tickets-timeline.md) |
| Automatizaciones (SLA, auto-asignar, auto-cierre) | [04-tickets-automatizaciones.md](04-tickets-automatizaciones.md) |
| Estadísticas mensuales / resumen / SLA compliance | [05-tickets-estadisticas.md](05-tickets-estadisticas.md) |
| Base de conocimiento, votar artículos | [06-base-conocimiento.md](06-base-conocimiento.md) |
| Notificaciones, mensajes del ticket | [08-notificaciones-y-mensajes.md](08-notificaciones-y-mensajes.md) |
| Categorías | [02-categorias.md](02-categorias.md) |
| Usuarios | [03-usuarios.md](03-usuarios.md) |
| Flujo CSRF completo | [07-flujo-csrf.md](07-flujo-csrf.md) |

---

## Errores Comunes

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

---

## Seguridad (resumen)

- Login JWT en **cookie HttpOnly** (`access_token`).
- Los POST que modifican datos requieren header **`X-XSRF-TOKEN`** con el valor de la cookie `XSRF-TOKEN`.
- **Antes de escribir**, pedir el token al servidor: `GET /auth/csrf` → guarda la cookie `XSRF-TOKEN` y devuelve el token en el body. Usar ese mismo valor en el header.