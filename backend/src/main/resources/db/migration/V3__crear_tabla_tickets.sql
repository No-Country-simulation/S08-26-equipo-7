CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id),
    email VARCHAR(150) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),
    prioridad VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    requiere_aprobacion BOOLEAN NOT NULL DEFAULT false,
    creado_en TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_tickets_usuario_id ON tickets(usuario_id);
CREATE INDEX idx_tickets_estado ON tickets(estado);