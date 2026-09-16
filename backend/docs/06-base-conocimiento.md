# Base de Conocimiento (Auto-Servicio)

Artículos para la sección "Base de Conocimiento & Auto-Servicio": tarjetas con categoría, contador de lecturas, título y descripción.

## Campos del artículo (respuesta)

| Campo | Descripción |
|---|---|
| `id` | UUID del artículo |
| `titulo` | Título del artículo |
| `descripcion` | Descripción corta (para la tarjeta) |
| `contenido` | Texto completo del artículo |
| `categoria` | Code de la categoría (ej. `IT`, `ACCESS`, `FINANCE`, `FACILITIES`) |
| `visualizaciones` | Contador de lecturas/vistas |
| `activo` | Si está publicado (`true`) o desactivado (`false`) |

## GET /knowledge

Lista los artículos **activos** (los desactivados quedan ocultos) ordenados por más reciente. **Público** (sin login).

```json
[
  {
    "id": "11111111-...",
    "titulo": "Cómo conectar y configurar la VPN corporativa GlobalProtect",
    "descripcion": "Guía paso a paso para autenticación multifactor...",
    "categoria": "IT",
    "visualizaciones": 1402,
    "activo": true
  }
]
```

## GET /knowledge/{id}

Trae un artículo por ID (con su `contenido`). **Público**. `404` si no existe.

## POST /knowledge/{id}/view

Incrementa en 1 las `visualizaciones` del artículo. **Público** y sin CSRF (es un contador de clics).

```json
// respuesta 200
{ "id": "11111111-...", "visualizaciones": 1403 }
```

## POST /knowledge

Crea un artículo. **Solo ADMIN** (403 para otros roles). Requiere CSRF.

```json
// body
{ "titulo": "Nuevo artículo", "descripcion": "...", "contenido": "...", "categoria": "IT" }
```

`201` con el artículo creado.

## PUT /knowledge/{id}

Edita un artículo (títulos, descripción, contenido, categoría o `activo`). **Solo ADMIN**. Requiere CSRF.

```json
// body (todos opcionales, parcialmente)
{ "titulo": "Nuevo título", "descripcion": "...", "contenido": "...", "categoria": "IT", "activo": false }
```

`200` con el artículo actualizado. `404` si no existe.