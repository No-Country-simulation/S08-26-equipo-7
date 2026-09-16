-- Estandariza todos los timestamps existentes a UTC (antes guardados en America/Bogota, UTC-5).
UPDATE roles SET creado_en = creado_en AT TIME ZONE 'America/Bogota' AT TIME ZONE 'UTC' WHERE creado_en IS NOT NULL;

UPDATE usuarios SET creado_en = creado_en AT TIME ZONE 'America/Bogota' AT TIME ZONE 'UTC' WHERE creado_en IS NOT NULL;

UPDATE categorias SET creado_en = creado_en AT TIME ZONE 'America/Bogota' AT TIME ZONE 'UTC' WHERE creado_en IS NOT NULL;

UPDATE tickets SET
    creado_en = creado_en AT TIME ZONE 'America/Bogota' AT TIME ZONE 'UTC',
    actualizado_en = actualizado_en AT TIME ZONE 'America/Bogota' AT TIME ZONE 'UTC',
    sla_due_at = sla_due_at AT TIME ZONE 'America/Bogota' AT TIME ZONE 'UTC',
    resuelto_en = resuelto_en AT TIME ZONE 'America/Bogota' AT TIME ZONE 'UTC',
    cerrado_en = cerrado_en AT TIME ZONE 'America/Bogota' AT TIME ZONE 'UTC'
WHERE creado_en IS NOT NULL;

UPDATE articulos SET
    creado_en = creado_en AT TIME ZONE 'America/Bogota' AT TIME ZONE 'UTC',
    actualizado_en = actualizado_en AT TIME ZONE 'America/Bogota' AT TIME ZONE 'UTC'
WHERE creado_en IS NOT NULL;