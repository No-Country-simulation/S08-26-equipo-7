# Auth

Base: `/api/v1/auth`

## POST /auth/login

Inicia sesión y setea la cookie `access_token` (HttpOnly).

```json
// body
{ "email": "admin@serviceflow.com", "password": "Admin123!" }
```

```json
// respuesta 200
{ "nombre": "Alejandro", "rol": "ADMIN" }
```

- `400` si falta algún campo
- `401` si las credenciales son inválidas

## GET /auth/csrf

Devuelve el token CSRF y setea la cookie `XSRF-TOKEN` (público). **Llamar antes del primer POST** para no recibir un 403 en la primera escritura.

```json
// respuesta 200
{ "token": "a654aa5c-5e7e-40a8-af97-52ce98fd981c" }
```

Uso: el mismo valor del body va como header `X-XSRF-TOKEN` en los POST siguientes.

## POST /auth/recover-password

Genera un ticket de recuperación — **siempre devuelve 200** (no revela si el email existe). Inserta el ticket solo cuando el email existe en la BD. Rate limit: **máx. 3 peticiones / 15 min por IP** (la 4ta responde `429`). Ruta **pública** (no requiere token).

```json
// body
{ "email": "usuario@empresa.com" }
```

```json
// respuesta 200
{ "message": "If the email exists, we will process the request" }
```

## GET /auth/me

Devuelve la sesión actual (requiere cookie `access_token`).

```json
// respuesta 200
{ "nombre": "Alejandro", "rol": "ADMIN" }
```

- `401` si no hay token

## POST /auth/logout

Cierra la sesión (borra la cookie).

```json
// respuesta 200
{ "mensaje": "Sesión cerrada" }
```