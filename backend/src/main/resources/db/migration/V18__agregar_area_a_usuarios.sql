-- Área del usuario (ej. HARDWARE, IT, FINANCE). Opcional; se usa para
-- auto-asignación y búsqueda de agentes por área. Requesters no la necesitan.
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS area VARCHAR(50);

CREATE INDEX IF NOT EXISTS idx_usuarios_area ON usuarios(area);
