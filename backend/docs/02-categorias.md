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