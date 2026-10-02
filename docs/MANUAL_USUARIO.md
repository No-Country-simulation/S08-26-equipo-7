<div align="center">
<p align="center"><img src="../photos/serviceflow-logo-light.svg" alt="ServiceFlow" width="300"></p>
</div>

<h1 align="center"><strong>Manual de Usuario de ServiceFlow</strong></h1>

Manual de operación para solicitantes, agentes, supervisores y administradores. Los nombres exactos de algunos botones pueden variar entre versiones; el flujo descrito corresponde a las capacidades documentadas del sistema.

## Índice

- [Acceso al sistema](#acceso-al-sistema)
- [Conceptos del flujo](#conceptos-del-flujo)
- [Solicitante](#1-solicitante-requester)
- [Agente](#2-agente-agent)
- [Supervisor](#3-supervisor-supervisor)
- [Administrador](#4-administrador-admin)
- [Estados, prioridades y SLA](#estados-prioridades-y-sla)
- [Notificaciones y problemas frecuentes](#notificaciones-y-problemas-frecuentes)

## Acceso al sistema

1. Abre la dirección de la aplicación proporcionada por el equipo.
2. Ingresa el correo y la contraseña asignados a tu cuenta y selecciona **Iniciar sesión**.
3. Si no recuerdas la contraseña, utiliza **¿Olvidaste tu contraseña?** y envía el correo asociado. Por seguridad, el sistema no confirma si ese correo está registrado.
4. Para salir, utiliza la opción **Cerrar sesión** del menú de usuario.

Las cuentas demo están en [Credenciales de prueba](../README.md#-credenciales-de-prueba-seed-data). No uses cuentas demo en producción ni compartas sus contraseñas.

## Conceptos del flujo

Cada ticket conserva un código corto, solicitante, categoría, prioridad, estado, responsable, vencimiento SLA, historial y conversación. El flujo habitual es:

**Solicitud → categorización y priorización → asignación → aprobación (si aplica) → atención → resolución → cierre.**

Al crear un ticket, el sistema aplica la categoría y su prioridad predeterminada, calcula el SLA y lo asigna al agente disponible con menos tickets activos. Si la categoría requiere aprobación, queda pendiente de aprobación. Las acciones automáticas se registran en la línea de tiempo.

## 1. Solicitante (REQUESTER)

### Crear una solicitud

1. Inicia sesión con tu cuenta.
2. Abre la opción de creación de ticket.
3. Escribe un título breve que resuma el problema.
4. Describe qué ocurre, desde cuándo y qué impacto tiene. No incluyas contraseñas ni información sensible.
5. Selecciona la categoría más adecuada y envía la solicitud.
6. Guarda el código del ticket para localizarlo posteriormente.

El sistema registra la solicitud y aplica la automatización correspondiente. La categoría puede determinar prioridad inicial, SLA y si hace falta aprobación.

### Consultar y seguir un ticket

1. Abre tu listado de tickets.
2. Busca por código o título, o filtra por estado.
3. Abre el ticket para consultar su estado, responsable, fechas, mensajes e historial.
4. Revisa las notificaciones para enterarte de cambios, respuestas o solicitudes de información.

### Responder en la conversación

1. Abre el ticket correspondiente.
2. Escribe la información adicional solicitada en el área de mensajes/comentarios.
3. Envía el mensaje y vuelve a revisar el ticket para seguir la respuesta del equipo.

Los mensajes quedan asociados al ticket; al agregar uno, el sistema registra un evento y avisa a la otra parte.

### Cerrar una solicitud resuelta

1. Abre un ticket en estado `RESOLVED`.
2. Comprueba la resolución y la conversación.
3. Si está resuelto, utiliza la acción de cierre disponible.

El solicitante puede cerrar sus propios tickets resueltos. Si no se cierran, los tickets resueltos se cierran automáticamente tras 48 horas sin actividad.

### Consultar la base de conocimiento

1. Abre **Base de conocimiento**.
2. Busca o selecciona un artículo relacionado con tu consulta.
3. Lee el contenido y utiliza la valoración de utilidad si está disponible.

Los artículos publicados pueden consultarse sin iniciar sesión.

## 2. Agente (AGENT)

### Revisar la cola de trabajo

1. Inicia sesión y abre la lista de tickets.
2. Revisa tus tickets asignados, las notificaciones y los vencimientos SLA.
3. Prioriza los tickets urgentes o próximos a vencer y consulta la categoría y descripción antes de empezar.
4. Abre un ticket para consultar los mensajes y el historial.

La asignación automática busca al agente con menos tickets activos. Si no hay agentes disponibles, el ticket puede permanecer priorizado sin asignar.

### Atender un ticket

1. Abre un ticket asignado que todavía no esté cerrado ni resuelto.
2. Si corresponde, usa **Iniciar** para pasarlo a `IN_PROGRESS`.
3. Comunica avances o solicita información adicional usando los mensajes del ticket.
4. Registra las acciones en el propio ticket; evita mover la conversación a canales sin trazabilidad.
5. Cuando el trabajo esté terminado, usa **Resolver**. El ticket pasa a `RESOLVED` y el solicitante recibe una notificación.

### Categorizar o priorizar

1. Revisa si la categoría y prioridad corresponden al caso.
2. Si tienes autorización, cambia la categoría o la prioridad mediante las acciones disponibles.
3. La prioridad determina el plazo SLA: urgente 4 h, alta 8 h, media 24 h y baja 72 h desde la priorización.

### Escalar un ticket

1. Escala el ticket si requiere intervención adicional o no puede resolverse en el nivel actual.
2. Añade contexto útil en el hilo.
3. Verifica que aparezca como `ESCALATED` / grupo `EXPIRADO` y que el supervisor haya sido notificado.

El sistema también escala automáticamente tickets activos con SLA vencido y notifica al solicitante, al agente y a supervisores.

## 3. Supervisor (SUPERVISOR)

### Revisar la operación

1. Inicia sesión y consulta la lista de tickets.
2. Usa búsqueda y filtros de estado, categoría, prioridad o grupo para identificar pendientes, aprobaciones y vencimientos.
3. Consulta las notificaciones y revisa la línea de tiempo para reconstruir decisiones o demoras.

### Asignar o reasignar

1. Abre el ticket que requiere responsable.
2. Selecciona la acción de asignación y busca un agente disponible.
3. Confirma y verifica el responsable mostrado en el ticket.

Supervisores y administradores pueden asignar agentes. Considera el área y la carga de trabajo al distribuir solicitudes.

### Gestionar aprobaciones

1. Identifica tickets de categorías que requieren aprobación.
2. Revisa la solicitud, categoría, descripción y contexto.
3. Usa **Aprobar** si procede.
4. Comprueba el cambio de estado y el evento registrado.

La API documenta la aprobación; no asumas que existe una acción de rechazo si no aparece en la interfaz.

### Atender escalaciones y SLA

1. Filtra por tickets escalados (`ESCALATED`, grupo `EXPIRADO`) o próximos a vencer.
2. Revisa el historial y el motivo del escalamiento.
3. Coordina la reasignación o intervención y registra el seguimiento en el ticket.
4. Consulta el resumen estadístico para revisar tickets activos, próximos a vencer, vencidos y cumplimiento.

## 4. Administrador (ADMIN)

### Administrar usuarios

1. Abre **Usuarios**.
2. Para crear una cuenta, ingresa nombre, correo, rol y contraseña (mínimo 8 caracteres); el área puede asignarse cuando corresponda.
3. Guarda y confirma que aparezca en el listado.
4. Asigna el rol mínimo necesario para sus responsabilidades.

Roles permitidos: `REQUESTER`, `AGENT`, `SUPERVISOR` y `ADMIN`. El listado no expone hashes de contraseña. Los usuarios pueden cambiar su propia contraseña indicando la actual y una nueva.

### Administrar categorías

1. Abre **Categorías**.
2. Crea o edita el código, nombre y descripción.
3. Configura si está activa, si requiere aprobación y la prioridad predeterminada, cuando estén disponibles.
4. Guarda los cambios. Desactiva categorías que ya no deban seleccionarse, en lugar de borrar referencias históricas.

### Administrar artículos de conocimiento

1. Abre **Base de conocimiento** y selecciona crear o editar.
2. Completa título, descripción, contenido y categoría.
3. Publica o desactiva el artículo según corresponda.
4. Revisa visualizaciones y valoraciones para identificar contenido que deba actualizarse.

### Consultar métricas

1. Abre el panel administrativo.
2. Revisa tickets activos, SLA próximos/vencidos, tickets resueltos y cumplimiento.
3. Selecciona el mes si la interfaz permite cambiar el período.
4. Usa los resultados para detectar acumulación, demoras y categorías con alta demanda.

La API expone estadísticas mensuales y un resumen; no se documenta exportación de reportes.

## Estados, prioridades y SLA

| Grupo visible | Estados del flujo | Significado general |
|---|---|---|
| `PENDIENTE` | `SUBMITTED`, `CATEGORIZED`, `PRIORITIZED` | Solicitud en clasificación, prioridad o espera de asignación. |
| `EN_PROCESO` | `ASSIGNED`, `IN_PROGRESS` | Asignada o en atención. |
| `EN_APROBACION` | `APPROVED` | Grupo de aprobación definido por el backend. |
| `EXPIRADO` | `ESCALATED` | Ticket escalado manualmente o por vencimiento del SLA. |
| `RESUELTO` | `RESOLVED`, `CLOSED` | Solución aplicada o ticket cerrado. |

| Prioridad | SLA |
|---|---:|
| `URGENT` | 4 horas |
| `HIGH` | 8 horas |
| `MEDIUM` | 24 horas |
| `LOW` | 72 horas |

El backend revisa vencimientos periódicamente. Los tickets activos con SLA vencido se escalan automáticamente. Los tickets resueltos sin actividad se cierran automáticamente después de 48 horas.

## Notificaciones y problemas frecuentes

- **No puedo iniciar sesión:** verifica correo y contraseña; pide al administrador que confirme la cuenta. Usa recuperación de contraseña si corresponde.
- **No veo un ticket:** comprueba que los filtros no oculten su estado y busca por código. El alcance depende del rol.
- **No puedo ejecutar una acción:** puede que tu rol no tenga permiso o que el ticket no esté en el estado requerido. Consulta los estados y contacta al supervisor.
- **La solicitud requiere aprobación:** espera la decisión del supervisor; la atención sigue el flujo definido para esa categoría.
- **No recibo una actualización:** abre el ticket y revisa su historial y mensajes; las notificaciones son avisos asociados al usuario.

---
<div align="center"><strong>S08-26-equipo-7 - NoCountry 2026</strong></div>
