-- Ampliar límites: titulo 150 -> 180, descripcion 255 -> 1000
ALTER TABLE tickets ALTER COLUMN titulo TYPE VARCHAR(180);
ALTER TABLE tickets ALTER COLUMN descripcion TYPE VARCHAR(1000);
