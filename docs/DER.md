<p align="center"><img src="../photos/serviceflow-logo-light.svg" alt="ServiceFlow" width="300"></p>

<h1 align="center"><strong>Arquitectura de Datos — ServiceFlow</strong></h1>

<div align="center"><strong>S08-26-equipo-7 - NoCountry 2026</strong></div>

Diagrama lógico de las entidades principales que se desprenden de la API y del modelo funcional. Los nombres de campos describen el modelo expuesto por la API; pueden diferir de los nombres físicos usados en la base de datos.

```mermaid
erDiagram
    USUARIO ||--o{ TICKET : solicita
    USUARIO o|--o{ TICKET : tiene_asignados
    CATEGORIA ||--o{ TICKET : clasifica
    TICKET ||--o{ MENSAJE : contiene
    TICKET ||--o{ EVENTO_TICKET : registra
    USUARIO ||--o{ NOTIFICACION : recibe
    TICKET o|--o{ NOTIFICACION : referencia
    CATEGORIA ||--o{ ARTICULO : organiza

    USUARIO {
        uuid id PK
        string nombre
        string email
        string rol
        string area
        datetime createdAt
    }
    CATEGORIA {
        uuid id PK
        string code
        string name
        string description
        boolean active
        boolean requiresApproval
        string prioridadDefecto
    }
    TICKET {
        uuid id PK
        string codigo
        string title
        string description
        uuid solicitanteId FK
        uuid categoriaId FK
        uuid agenteAsignadoId FK
        string priority
        string status
        datetime slaDueAt
        datetime resolvedAt
        datetime closedAt
        datetime createdAt
        datetime updatedAt
    }
    MENSAJE {
        uuid id PK
        uuid ticketId FK
        string autorEmail
        string autorNombre
        string mensaje
        datetime creadoEn
    }
    EVENTO_TICKET {
        uuid id PK
        uuid ticketId FK
        string tipo
        string descripcion
        string actorEmail
        string actorNombre
        datetime fecha
    }
    ARTICULO {
        uuid id PK
        string titulo
        string descripcion
        string contenido
        uuid categoriaId FK
        int visualizaciones
        int megusta
        int nomegusta
        boolean activo
        datetime actualizadoEn
    }
    NOTIFICACION {
        uuid id PK
        uuid usuarioId FK
        uuid ticketId FK
        string tipo
        string mensaje
        boolean leida
        datetime creadoEn
    }
```

## Relaciones principales

- Un usuario puede solicitar muchos tickets y un ticket tiene un solicitante.
- Un agente puede tener asignados varios tickets; la asignación puede estar vacía.
- Cada ticket pertenece a una categoría.
- Un ticket puede tener varios mensajes y eventos de historial.
- Las notificaciones pertenecen a un usuario y pueden referenciar un ticket.
- Una categoría puede organizar varios artículos de conocimiento.

> [!NOTE]
> Este DER es una vista lógica resumida de la funcionalidad/API, no una extracción exacta del esquema físico de PostgreSQL. Los artículos de conocimiento son públicos y la API no expone una relación de autor; por eso no se inventa una relación artículo-usuario.
