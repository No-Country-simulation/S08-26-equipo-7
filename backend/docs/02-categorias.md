# Categorías

Las categorías se gestionan desde la BD. El front carga las categorías dinámicamente desde esta tabla.

## GET /categories

Lista categorías **activas**. Ruta **pública** (no requiere token).

```json
// respuesta 200
[
  { "id": "uuid", "code": "IT", "name": "Infraestructura IT",
    "description": "Equipos, redes, VPN y sistemas", "active": true, "requiresApproval": false },
  { "id": "uuid", "code": "ACCESS", "name": "Accesos y Seguridad",
    "description": "Usuarios, permisos y credenciales", "active": true, "requiresApproval": true },
  { "id": "uuid", "code": "HARDWARE", "name": "Hardware",
    "description": "Equipos y periféricos", "active": true, "requiresApproval": true },
  { "id": "uuid", "code": "FACILITIES", "name": "Facilities y Logística",
    "description": "Espacios físicos, mantenimiento y logística", "active": true, "requiresApproval": false },
  { "id": "uuid", "code": "FINANCE", "name": "Finanzas y Compras",
    "description": "Compras, gastos y viáticos", "active": true, "requiresApproval": true }
]
```

## GET /categories/all

Lista **todas** las categorías (incluyendo inactivas). **Solo ADMIN**.

```json
// respuesta 200
[ { "id": "uuid", "code": "SECURITY", "name": "Ciberseguridad", "description": "...", "active": false, "requiresApproval": true } ]
```

## Agentes demo por área

La migración `V22` crea dos usuarios con rol `AGENT` para cada categoría activa. El valor de `area` de cada usuario es el mismo `code` de la categoría y sus credenciales de prueba son las mismas que las de `agente@serviceflow.com` (ver [usuarios demo](03-usuarios.md)).

| Categoría / área | Agente 1 | Agente 2 |
|---|---|---|
| `IT` | `agente.it.01@serviceflow.com` | `agente.it.02@serviceflow.com` |
| `ACCESS` | `agente.access.01@serviceflow.com` | `agente.access.02@serviceflow.com` |
| `HARDWARE` | `agente.hardware.01@serviceflow.com` | `agente.hardware.02@serviceflow.com` |
| `FACILITIES` | `agente.facilities.01@serviceflow.com` | `agente.facilities.02@serviceflow.com` |
| `FINANCE` | `agente.finance.01@serviceflow.com` | `agente.finance.02@serviceflow.com` |

Solo se crean agentes para categorías activas al ejecutar la migración. Las categorías inactivas no aceptan tickets nuevos y no reciben agentes demo.

## POST /categories

Crea una categoría. **Solo ADMIN**.

```json
// body
{ "code": "SECURITY", "name": "Ciberseguridad", "description": "Filtraciones, malware, ransomware", "requiresApproval": true }
```

```json
// respuesta 201
{ "id": "uuid", "code": "SECURITY", "name": "Ciberseguridad", "description": "Filtraciones, malware, ransomware", "active": true, "requiresApproval": true }
```

- `409` si el `code` ya existe
- `422` si falta `code` o `name`

## PUT /categories/{id}

Actualiza nombre, descripción, estado o `requiresApproval`. **Solo ADMIN**.

```json
// body (todos opcionales)
{ "name": "Nuevo nombre", "description": "...", "active": false, "requiresApproval": true }
```

```json
// respuesta 200 → objeto actualizado
```

- `404` si no existe el ID

## POST /categories/{id}/toggle

Activa/desactiva una categoría. **Solo ADMIN**.

```json
// respuesta 200
{ "message": "Category toggled" }
```

- `404` si no existe
