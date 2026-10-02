-- Layout del editor de bloques por artículo (JSON flexible, lo valida el front).
-- Default '{}' para no romper los artículos existentes.
ALTER TABLE articulos ADD COLUMN IF NOT EXISTS layout_config JSONB NOT NULL DEFAULT '{}';

UPDATE articulos SET layout_config = '{}' WHERE layout_config IS NULL;
