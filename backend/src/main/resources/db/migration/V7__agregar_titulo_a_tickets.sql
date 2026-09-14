ALTER TABLE tickets ADD COLUMN IF NOT EXISTS titulo VARCHAR(150);

UPDATE tickets SET titulo = LEFT(descripcion, 150) WHERE titulo IS NULL OR titulo = '';

ALTER TABLE tickets ALTER COLUMN titulo SET NOT NULL;