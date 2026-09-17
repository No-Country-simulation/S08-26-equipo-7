-- Migracion V12: insertar tickets de prueba con SLA relativo al momento de ejecucion.
-- Los vencidos quedan con SLA negativo y algunos pendientes con 11 horas restantes.

WITH datos(codigo, categoria, prioridad, estado, requiere_aprobacion) AS (
    VALUES
        ('PR-0001', 'PASSWORD_RECOVERY', 'HIGH', 'SUBMITTED', false),
        ('ACC-0002', 'ACCESS', 'URGENT', 'SUBMITTED', true),
        ('FIN-0003', 'FINANCE', 'HIGH', 'ESCALATED', true),
        ('IT-0004', 'IT', 'LOW', 'CLOSED', false),
        ('HW-0005', 'HARDWARE', 'HIGH', 'IN_PROGRESS', true),
        ('HW-0006', 'HARDWARE', 'LOW', 'CLOSED', true),
        ('FAC-0007', 'FACILITIES', 'HIGH', 'RESOLVED', false),
        ('PR-0008', 'PASSWORD_RECOVERY', 'URGENT', 'IN_PROGRESS', false),
        ('HW-0009', 'HARDWARE', 'MEDIUM', 'IN_PROGRESS', true),
        ('ACC-0010', 'ACCESS', 'MEDIUM', 'IN_PROGRESS', true),
        ('PR-0011', 'PASSWORD_RECOVERY', 'URGENT', 'SUBMITTED', false),
        ('HW-0012', 'HARDWARE', 'URGENT', 'SUBMITTED', true),
        ('PR-0013', 'PASSWORD_RECOVERY', 'URGENT', 'RESOLVED', false),
        ('FAC-0014', 'FACILITIES', 'MEDIUM', 'CLOSED', false),
        ('FAC-0015', 'FACILITIES', 'URGENT', 'CLOSED', false),
        ('FIN-0016', 'FINANCE', 'HIGH', 'SUBMITTED', true),
        ('IT-0017', 'IT', 'HIGH', 'CLOSED', false),
        ('ACC-0018', 'ACCESS', 'HIGH', 'CLOSED', true),
        ('HW-0019', 'HARDWARE', 'MEDIUM', 'RESOLVED', true),
        ('ACC-0020', 'ACCESS', 'MEDIUM', 'SUBMITTED', true),
        ('ACC-0021', 'ACCESS', 'LOW', 'ESCALATED', true),
        ('PR-0022', 'PASSWORD_RECOVERY', 'MEDIUM', 'ESCALATED', false),
        ('IT-0023', 'IT', 'MEDIUM', 'IN_PROGRESS', false),
        ('FIN-0024', 'FINANCE', 'LOW', 'CLOSED', true),
        ('HW-0025', 'HARDWARE', 'LOW', 'ESCALATED', true),
        ('HW-0026', 'HARDWARE', 'LOW', 'SUBMITTED', true),
        ('ACC-0027', 'ACCESS', 'HIGH', 'CLOSED', true),
        ('PR-0028', 'PASSWORD_RECOVERY', 'HIGH', 'IN_PROGRESS', false),
        ('PR-0029', 'PASSWORD_RECOVERY', 'LOW', 'IN_PROGRESS', false),
        ('FIN-0030', 'FINANCE', 'MEDIUM', 'IN_PROGRESS', true),
        ('PR-0031', 'PASSWORD_RECOVERY', 'MEDIUM', 'IN_PROGRESS', false),
        ('FAC-0032', 'FACILITIES', 'HIGH', 'SUBMITTED', false),
        ('FAC-0033', 'FACILITIES', 'URGENT', 'IN_PROGRESS', false),
        ('IT-0034', 'IT', 'URGENT', 'RESOLVED', false),
        ('FIN-0035', 'FINANCE', 'LOW', 'CLOSED', true)
), numerados AS (
    SELECT datos.*, row_number() OVER (ORDER BY codigo) AS numero
    FROM datos
), preparados AS (
    SELECT
        n.*,
        CURRENT_TIMESTAMP - (n.numero * INTERVAL '1 day') AS creado_en,
        CASE
            WHEN n.estado = 'SUBMITTED' THEN NULL
            ELSE u.id
        END AS asignado_a,
        CASE
            WHEN n.estado IN ('RESOLVED', 'CLOSED') THEN CURRENT_TIMESTAMP
            WHEN n.codigo IN ('FIN-0003', 'ACC-0021', 'HW-0025', 'PR-0022', 'PR-0008', 'IT-0023')
                THEN CURRENT_TIMESTAMP - INTERVAL '2 hours'
            WHEN n.codigo IN ('PR-0001', 'ACC-0002', 'FIN-0016', 'HW-0012', 'FAC-0032', 'ACC-0020')
                THEN CURRENT_TIMESTAMP + INTERVAL '11 hours'
            ELSE CURRENT_TIMESTAMP + INTERVAL '24 hours'
        END AS sla_due_at,
        CASE
            WHEN n.estado IN ('RESOLVED', 'CLOSED') THEN CURRENT_TIMESTAMP - INTERVAL '1 hour'
            ELSE NULL
        END AS resuelto_en,
        CASE
            WHEN n.estado = 'CLOSED' THEN CURRENT_TIMESTAMP - INTERVAL '30 minutes'
            ELSE NULL
        END AS cerrado_en,
        u.id AS usuario_id,
        u.email
    FROM numerados n
    CROSS JOIN (
        SELECT id, email
        FROM usuarios
        WHERE email = 'admin@serviceflow.com'
        LIMIT 1
    ) u
)
INSERT INTO tickets (
    usuario_id, email, categoria, descripcion, prioridad, estado,
    requiere_aprobacion, creado_en, asignado_a, sla_due_at,
    resuelto_en, cerrado_en, titulo, codigo, actualizado_en
)
SELECT
    p.usuario_id,
    p.email,
    p.categoria,
    'Incidencia de prueba generada automaticamente para la categoria ' || p.categoria || '.',
    p.prioridad,
    p.estado,
    p.requiere_aprobacion,
    p.creado_en,
    p.asignado_a,
    p.sla_due_at,
    p.resuelto_en,
    p.cerrado_en,
    'Solicitud de servicio ' || p.categoria || ' #' || p.numero,
    p.codigo,
    CURRENT_TIMESTAMP
FROM preparados p
WHERE NOT EXISTS (
    SELECT 1
    FROM tickets existente
    WHERE existente.codigo = p.codigo
);
