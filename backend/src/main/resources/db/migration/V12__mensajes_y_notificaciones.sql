CREATE TABLE IF NOT EXISTS ticket_mensajes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    autor_email VARCHAR(150),
    autor_nombre VARCHAR(100),
    mensaje VARCHAR(500) NOT NULL,
    creado_en TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ticket_mensajes_ticket ON ticket_mensajes(ticket_id, creado_en);

CREATE TABLE IF NOT EXISTS notificaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    tipo VARCHAR(30) NOT NULL,
    mensaje VARCHAR(255) NOT NULL,
    leida BOOLEAN NOT NULL DEFAULT false,
    creado_en TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON notificaciones(usuario_id, leida, creado_en);

ALTER TABLE categorias ADD COLUMN IF NOT EXISTS prioridad_defecto VARCHAR(20) NOT NULL DEFAULT 'MEDIUM';

UPDATE categorias SET prioridad_defecto = 'HIGH' WHERE code = 'HARDWARE';
UPDATE categorias SET prioridad_defecto = 'HIGH' WHERE code = 'ACCESS';
UPDATE categorias SET prioridad_defecto = 'URGENT' WHERE code = 'PASSWORD_RECOVERY';