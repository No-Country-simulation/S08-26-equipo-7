# Ejemplo completo: login + CSRF + flujo de ticket

El front (SPA) debe obtener el token CSRF **antes** de escribir, para no recibir un 403 en la primera request.

## 1. Obtener el token CSRF (público)

```
GET /api/v1/auth/csrf
```

Respuesta: guarda la cookie `XSRF-TOKEN` y devuelve el token en el body:

```json
{ "token": "a654aa5c-5e7e-40a8-af97-52ce98fd981c" }
```

A partir de acá, todo POST con datos lleva `X-XSRF-TOKEN: <ese token>`.

## 2. Login

```
POST /api/v1/auth/login
Body: { "email": "admin@serviceflow.com", "password": "Admin123!" }
```

Devuelve `{ "nombre": "Alejandro", "rol": "ADMIN" }` y setea la cookie `access_token` (HttpOnly).

## 3. Categorías

```
GET /api/v1/categories
```

Devuelve la lista activa para armar el formulario.

## 4. Crear el ticket (con CSRF)

```
POST /api/v1/tickets
Header: X-XSRF-TOKEN: <token>
Body: { "title": "No enciende mi notebook", "description": "No arranca", "category": "HARDWARE" }
```

`201` → ticket `SUBMITTED`, prioridad `MEDIUM` automática, `requiresApproval` según categoría.

## 5. Ciclo de vida (todas con CSRF)

| Paso | Endpoint | Estado resultante |
|---|---|---|
| 6. | `POST /tickets/{id}/categorize?category=HARDWARE` | `CATEGORIZED` |
| 7. | `POST /tickets/{id}/prioritize?priority=HIGH` | `PRIORITIZED` (SLA 8h) |
| 8. | `POST /tickets/{id}/assign?assignedTo={agenteId}` | `ASSIGNED` |
| 9. | `POST /tickets/{id}/approve` (si `requiresApproval=true`) | `APPROVED` |
| 10. | `POST /tickets/{id}/start` | `IN_PROGRESS` |
| 11. | `POST /tickets/{id}/resolve` | `RESOLVED` |
| 12. | `POST /tickets/{id}/close` | `CLOSED` |

## 13. Stats

```
GET /tickets/stats/monthly?month=2026-09
GET /tickets/stats/summary?month=2026-09   (solo ADMIN/SUPERVISOR)
```

## 14. Listado con paginación

```
GET /tickets?limit=10&offset=0&sort=desc
```

## 15. Base de conocimiento

```
GET /knowledge                            (público)
POST /knowledge/{id}/view                 (público, sin CSRF)
POST /knowledge                           (ADMIN, con CSRF)
PUT /knowledge/{id}                       (ADMIN, con CSRF)
```