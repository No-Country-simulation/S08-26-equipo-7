ALTER TABLE tickets
    ADD COLUMN IF NOT EXISTS asignado_a UUID REFERENCES usuarios(id),
    ADD COLUMN IF NOT EXISTS sla_due_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS resuelto_en TIMESTAMP,
    ADD COLUMN IF NOT EXISTS cerrado_en TIMESTAMP;

UPDATE tickets SET estado = 'SUBMITTED' WHERE estado = 'PENDING';

CREATE INDEX IF NOT EXISTS idx_tickets_creado_en ON tickets(creado_en);
CREATE INDEX IF NOT EXISTS idx_tickets_sla_due_at ON tickets(sla_due_at);
CREATE INDEX IF NOT EXISTS idx_tickets_categoria ON tickets(categoria);
CREATE INDEX IF NOT EXISTS idx_tickets_estado ON tickets(estado);