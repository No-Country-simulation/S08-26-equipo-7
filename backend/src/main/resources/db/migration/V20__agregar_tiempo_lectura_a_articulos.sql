-- Tiempo de lectura manual (nullable: si es NULL se calcula del contenido).
ALTER TABLE articulos ADD COLUMN IF NOT EXISTS tiempo_lectura_min INTEGER;
