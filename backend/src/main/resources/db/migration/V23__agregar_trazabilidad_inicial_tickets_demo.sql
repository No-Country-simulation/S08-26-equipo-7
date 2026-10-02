-- Completa el historial inicial de tickets demo creados directamente en la base.
-- La secuencia refleja las etapas registradas por TicketService desde el frontend.
UPDATE ticket_eventos e
SET fecha = t.creado_en,
    actor_email = t.email,
    actor_nombre = solicitante.nombre
FROM tickets t
LEFT JOIN usuarios solicitante ON solicitante.id = t.usuario_id
WHERE e.ticket_id = t.id
  AND e.tipo = 'CREATED'
  AND t.codigo LIKE 'DEMO-%'
  AND t.estado IN (
      'SUBMITTED', 'CATEGORIZED', 'PRIORITIZED', 'ASSIGNED',
      'PENDING_APPROVAL', 'APPROVED', 'IN_PROGRESS'
  );

WITH tickets_demo AS (
    SELECT
        t.id,
        t.email,
        t.categoria,
        t.prioridad,
        t.estado,
        t.requiere_aprobacion,
        t.asignado_a,
        t.creado_en,
        solicitante.nombre AS solicitante_nombre,
        agente.nombre AS agente_nombre
    FROM tickets t
    LEFT JOIN usuarios solicitante ON solicitante.id = t.usuario_id
    LEFT JOIN usuarios agente ON agente.id = t.asignado_a
    WHERE t.codigo LIKE 'DEMO-%'
      AND t.estado IN (
          'SUBMITTED', 'CATEGORIZED', 'PRIORITIZED', 'ASSIGNED',
          'PENDING_APPROVAL', 'APPROVED', 'IN_PROGRESS'
      )
),
eventos_iniciales AS (
    SELECT id AS ticket_id, 'CREATED' AS tipo, 'Ticket creado' AS descripcion,
           email AS actor_email, solicitante_nombre AS actor_nombre, creado_en AS fecha
    FROM tickets_demo

    UNION ALL

    SELECT id, 'CATEGORIZED', 'Categoría asignada automáticamente: ' || categoria,
           NULL, 'Sistema', creado_en + INTERVAL '1 minute'
    FROM tickets_demo
    WHERE estado IN (
        'CATEGORIZED', 'PRIORITIZED', 'ASSIGNED', 'PENDING_APPROVAL', 'APPROVED', 'IN_PROGRESS'
    )

    UNION ALL

    SELECT id, 'PRIORITIZED', 'Prioridad asignada automáticamente: ' || prioridad,
           NULL, 'Sistema', creado_en + INTERVAL '2 minutes'
    FROM tickets_demo
    WHERE estado IN ('PRIORITIZED', 'ASSIGNED', 'PENDING_APPROVAL', 'APPROVED', 'IN_PROGRESS')

    UNION ALL

    SELECT id, 'ASSIGNED', 'Asignado automáticamente al agente ' || agente_nombre,
           NULL, 'Sistema', creado_en + INTERVAL '3 minutes'
    FROM tickets_demo
    WHERE estado IN ('ASSIGNED', 'PENDING_APPROVAL', 'APPROVED', 'IN_PROGRESS')
      AND asignado_a IS NOT NULL

    UNION ALL

    SELECT id, 'APPROVAL_REQUIRED', 'Requiere autorización gerencial obligatoria',
           NULL, 'Sistema', creado_en + INTERVAL '4 minutes'
    FROM tickets_demo
    WHERE requiere_aprobacion = TRUE
      AND estado IN ('PENDING_APPROVAL', 'APPROVED', 'IN_PROGRESS')

    UNION ALL

    SELECT id, 'APPROVED', 'Ticket aprobado',
           NULL, 'Sistema', creado_en + INTERVAL '5 minutes'
    FROM tickets_demo
    WHERE requiere_aprobacion = TRUE
      AND estado IN ('APPROVED', 'IN_PROGRESS')

    UNION ALL

    SELECT id, 'STARTED', 'Trabajo iniciado',
           NULL, 'Sistema', creado_en + INTERVAL '6 minutes'
    FROM tickets_demo
    WHERE estado = 'IN_PROGRESS'
)
INSERT INTO ticket_eventos (ticket_id, tipo, descripcion, actor_email, actor_nombre, fecha)
SELECT e.ticket_id, e.tipo, e.descripcion, e.actor_email, e.actor_nombre, e.fecha
FROM eventos_iniciales e
WHERE NOT EXISTS (
    SELECT 1
    FROM ticket_eventos existente
    WHERE existente.ticket_id = e.ticket_id
      AND existente.tipo = e.tipo
);
