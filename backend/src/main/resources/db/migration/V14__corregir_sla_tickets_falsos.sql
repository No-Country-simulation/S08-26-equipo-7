-- Corrige los tickets de prueba creados por V12 para que su SLA coincida con la prioridad.
WITH parametros AS (
    SELECT
        t.codigo,
        t.estado,
        CASE t.prioridad
            WHEN 'LOW' THEN INTERVAL '72 hours'
            WHEN 'MEDIUM' THEN INTERVAL '24 hours'
            WHEN 'HIGH' THEN INTERVAL '8 hours'
            WHEN 'URGENT' THEN INTERVAL '4 hours'
        END AS sla_duracion
    FROM tickets t
    WHERE t.codigo IN (
        'PR-0001', 'ACC-0002', 'FIN-0003', 'IT-0004', 'HW-0005', 'HW-0006',
        'FAC-0007', 'PR-0008', 'HW-0009', 'ACC-0010', 'PR-0011', 'HW-0012',
        'PR-0013', 'FAC-0014', 'FAC-0015', 'FIN-0016', 'IT-0017', 'ACC-0018',
        'HW-0019', 'ACC-0020', 'ACC-0021', 'PR-0022', 'IT-0023', 'FIN-0024',
        'HW-0025', 'HW-0026', 'ACC-0027', 'PR-0028', 'PR-0029', 'FIN-0030',
        'PR-0031', 'FAC-0032', 'FAC-0033', 'IT-0034', 'FIN-0035'
    )
), vencimientos AS (
    SELECT
        p.*,
        CASE
            WHEN p.estado IN ('RESOLVED', 'CLOSED') THEN CURRENT_TIMESTAMP - INTERVAL '1 hour'
            WHEN p.codigo IN ('FIN-0003', 'ACC-0021', 'HW-0025', 'PR-0022', 'PR-0008', 'IT-0023')
                THEN CURRENT_TIMESTAMP - INTERVAL '2 hours'
            WHEN p.codigo IN ('PR-0001', 'ACC-0002', 'FIN-0016', 'HW-0012', 'FAC-0032', 'ACC-0020')
                THEN CURRENT_TIMESTAMP + LEAST(INTERVAL '11 hours', p.sla_duracion - INTERVAL '1 hour')
            ELSE CURRENT_TIMESTAMP + p.sla_duracion
        END AS sla_due_at
    FROM parametros p
)
UPDATE tickets t
SET
    creado_en = v.sla_due_at - v.sla_duracion,
    sla_due_at = v.sla_due_at,
    actualizado_en = CURRENT_TIMESTAMP
FROM vencimientos v
WHERE t.codigo = v.codigo;