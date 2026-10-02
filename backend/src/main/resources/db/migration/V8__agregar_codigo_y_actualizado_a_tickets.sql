ALTER TABLE tickets ADD COLUMN IF NOT EXISTS codigo VARCHAR(20);
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS actualizado_en TIMESTAMP;

UPDATE tickets SET actualizado_en = COALESCE(cerrado_en, resuelto_en, creado_en)
WHERE actualizado_en IS NULL;

WITH numbered AS (
    SELECT id, row_number() OVER (ORDER BY creado_en) AS seq
    FROM tickets
)
UPDATE tickets t
SET codigo = UPPER(COALESCE(
        CASE t.categoria
            WHEN 'IT' THEN 'IT'
            WHEN 'ACCESS' THEN 'ACC'
            WHEN 'HARDWARE' THEN 'HW'
            WHEN 'FACILITIES' THEN 'FAC'
            WHEN 'FINANCE' THEN 'FIN'
            WHEN 'PASSWORD_RECOVERY' THEN 'PR'
            ELSE LEFT(t.categoria, 2)
        END, 'TK')) || '-' || LPAD(n.seq::text, 4, '0')
FROM numbered n
WHERE n.id = t.id AND t.codigo IS NULL;

ALTER TABLE tickets ALTER COLUMN codigo SET NOT NULL;
ALTER TABLE tickets ALTER COLUMN actualizado_en SET NOT NULL;