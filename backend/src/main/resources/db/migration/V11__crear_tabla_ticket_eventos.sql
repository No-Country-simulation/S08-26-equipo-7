CREATE TABLE IF NOT EXISTS ticket_eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    tipo VARCHAR(30) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    actor_email VARCHAR(150),
    actor_nombre VARCHAR(100),
    fecha TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ticket_eventos_ticket ON ticket_eventos(ticket_id, fecha);

INSERT INTO ticket_eventos (ticket_id, tipo, descripcion, actor_email, actor_nombre, fecha)
SELECT id, 'CREATED', 'Ticket creado', email, NULL, creado_en
FROM tickets
WHERE NOT EXISTS (
    SELECT 1 FROM ticket_eventos e WHERE e.ticket_id = tickets.id AND e.tipo = 'CREATED'
);

INSERT INTO ticket_eventos (ticket_id, tipo, descripcion, actor_email, actor_nombre, fecha)
SELECT id, 'RESOLVED', 'Ticket resuelto', NULL, NULL, resuelto_en
FROM tickets
WHERE resuelto_en IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM ticket_eventos e WHERE e.ticket_id = tickets.id AND e.tipo = 'RESOLVED'
);

INSERT INTO ticket_eventos (ticket_id, tipo, descripcion, actor_email, actor_nombre, fecha)
SELECT id, 'CLOSED', 'Ticket cerrado', NULL, NULL, cerrado_en
FROM tickets
WHERE cerrado_en IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM ticket_eventos e WHERE e.ticket_id = tickets.id AND e.tipo = 'CLOSED'
);

INSERT INTO ticket_eventos (ticket_id, tipo, descripcion, actor_email, actor_nombre, fecha)
SELECT id, 'ESCALATED', 'Ticket expirado por SLA vencido', NULL, NULL, actualizado_en
FROM tickets
WHERE estado = 'ESCALATED'
  AND NOT EXISTS (
    SELECT 1 FROM ticket_eventos e WHERE e.ticket_id = tickets.id AND e.tipo = 'ESCALATED'
);