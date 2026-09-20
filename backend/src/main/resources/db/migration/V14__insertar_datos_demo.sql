-- Usuarios de demo adicionales
INSERT INTO usuarios (id, nombre, email, password_hash, rol_id, creado_en) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Carlos Requester', 'carlos.req@demo.com', '$2a$10$X7wZK8zYqL9vV2nJ3mK4Ou', (SELECT id FROM roles WHERE nombre = 'REQUESTER'), NOW() - INTERVAL '90 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Laura Requester', 'laura.req@demo.com', '$2a$10$X7wZK8zYqL9vV2nJ3mK4Ou', (SELECT id FROM roles WHERE nombre = 'REQUESTER'), NOW() - INTERVAL '85 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Pedro Requester', 'pedro.req@demo.com', '$2a$10$X7wZK8zYqL9vV2nJ3mK4Ou', (SELECT id FROM roles WHERE nombre = 'REQUESTER'), NOW() - INTERVAL '80 days'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Ana Agent', 'ana.agent@demo.com', '$2a$10$X7wZK8zYqL9vV2nJ3mK4Ou', (SELECT id FROM roles WHERE nombre = 'AGENT'), NOW() - INTERVAL '90 days'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Roberto Agent', 'roberto.agent@demo.com', '$2a$10$X7wZK8zYqL9vV2nJ3mK4Ou', (SELECT id FROM roles WHERE nombre = 'AGENT'), NOW() - INTERVAL '85 days'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Sofia Supervisor', 'sofia.sup@demo.com', '$2a$10$X7wZK8zYqL9vV2nJ3mK4Ou', (SELECT id FROM roles WHERE nombre = 'SUPERVISOR'), NOW() - INTERVAL '90 days')
ON CONFLICT (email) DO NOTHING;

-- Tickets de demo: distribuidos en 3 meses con estados variados y SLA coherente
WITH usuarios_demo AS (
    SELECT id, email FROM usuarios WHERE email LIKE '%@demo.com'
),
params AS (
    SELECT generate_series(1, 65) AS n
),
base AS (
    SELECT
        p.n,
        u.id AS usuario_id,
        u.email,
        CASE (p.n % 6)
            WHEN 0 THEN 'IT'
            WHEN 1 THEN 'HARDWARE'
            WHEN 2 THEN 'ACCESS'
            WHEN 3 THEN 'FINANCE'
            WHEN 4 THEN 'FACILITIES'
            ELSE 'PASS'
        END AS categoria,
        CASE (p.n % 4)
            WHEN 0 THEN 'LOW'
            WHEN 1 THEN 'MEDIUM'
            WHEN 2 THEN 'HIGH'
            ELSE 'URGENT'
        END AS prioridad,
        CASE (p.n % 7)
            WHEN 0 THEN 'SUBMITTED'
            WHEN 1 THEN 'CATEGORIZED'
            WHEN 2 THEN 'PRIORITIZED'
            WHEN 3 THEN 'ASSIGNED'
            WHEN 4 THEN 'IN_PROGRESS'
            WHEN 5 THEN 'RESOLVED'
            ELSE 'CLOSED'
        END AS estado,
        (p.n % 3 = 0) AS requiere_aprobacion,
        CASE (p.n % 5)
            WHEN 0 THEN (SELECT id FROM usuarios WHERE rol_id = (SELECT id FROM roles WHERE nombre = 'AGENT') ORDER BY random() LIMIT 1)
            WHEN 1 THEN (SELECT id FROM usuarios WHERE rol_id = (SELECT id FROM roles WHERE nombre = 'AGENT') ORDER BY random() LIMIT 1)
            ELSE NULL
        END AS asignado_a
    FROM params p
    CROSS JOIN LATERAL (
        SELECT id, email FROM usuarios WHERE email LIKE '%@demo.com' AND email LIKE '%req%'
        ORDER BY random() LIMIT 1
    ) u
),
sla_vals AS (
    SELECT
        b.*,
        CASE b.prioridad
            WHEN 'LOW' THEN INTERVAL '72 hours'
            WHEN 'MEDIUM' THEN INTERVAL '24 hours'
            WHEN 'HIGH' THEN INTERVAL '8 hours'
            ELSE INTERVAL '4 hours'
        END AS sla_duracion_val
    FROM base b
),
fechas_calc AS (
    SELECT
        s.*,
        CASE s.estado
            WHEN 'SUBMITTED' THEN NOW() - (random() * 2 + 0.5) * INTERVAL '1 day'
            WHEN 'CATEGORIZED' THEN NOW() - (random() * 3 + 1) * INTERVAL '1 day'
            WHEN 'PRIORITIZED' THEN NOW() - (random() * 4 + 1) * INTERVAL '1 day'
            WHEN 'ASSIGNED' THEN NOW() - (random() * 5 + 1) * INTERVAL '1 day'
            WHEN 'IN_PROGRESS' THEN NOW() - (random() * 7 + 2) * INTERVAL '1 day'
            WHEN 'RESOLVED' THEN NOW() - (random() * 30 + 10) * INTERVAL '1 day'
            ELSE NOW() - (random() * 60 + 20) * INTERVAL '1 day'
        END AS creado_en_val,
        s.sla_duracion_val
    FROM sla_vals s
),
sla_due_calc AS (
    SELECT
        f.*,
        CASE
            WHEN f.estado IN ('RESOLVED', 'CLOSED') THEN f.creado_en_val + f.sla_duracion_val * 0.6
            ELSE f.creado_en_val + f.sla_duracion_val
        END AS sla_due_at_val,
        CASE
            WHEN f.estado IN ('RESOLVED', 'CLOSED') THEN f.creado_en_val + f.sla_duracion_val * 0.6
            ELSE NULL
        END AS resuelto_en_val,
        CASE
            WHEN f.estado = 'CLOSED' THEN f.creado_en_val + f.sla_duracion_val + (random() * 2 + 1) * INTERVAL '1 day'
            ELSE NULL
        END AS cerrado_en_val
    FROM fechas_calc f
),
preparados AS (
    SELECT
        d.*,
        'DEMO-' || lpad(d.n::text, 4, '0') AS codigo,
        'Ticket de demostración ' || d.n || ' - ' || d.categoria AS titulo,
        'Descripción automática de prueba para el ticket ' || d.n || ' en categoría ' || d.categoria AS descripcion
    FROM fechas_calc d
)
INSERT INTO tickets (
    id, usuario_id, email, categoria, descripcion, prioridad, estado,
    requiere_aprobacion, creado_en, asignado_a, sla_due_at,
    resuelto_en, cerrado_en, titulo, codigo, actualizado_en
)
SELECT
    gen_random_uuid(),
    p.usuario_id,
    p.email,
    p.categoria,
    p.descripcion,
    p.prioridad,
    p.estado,
    p.requiere_aprobacion,
    p.creado_en_val,
    p.asignado_a,
    CASE
        WHEN p.estado IN ('RESOLVED', 'CLOSED') THEN p.creado_en_val + p.sla_duracion_val * 0.6
        ELSE p.creado_en_val + p.sla_duracion_val
    END AS sla_due_at,
    CASE
        WHEN p.estado IN ('RESOLVED', 'CLOSED') THEN p.creado_en_val + p.sla_duracion_val * 0.6
        ELSE NULL
    END AS resuelto_en,
    CASE
        WHEN p.estado = 'CLOSED' THEN p.creado_en_val + p.sla_duracion_val + (random() * 2 + 1) * INTERVAL '1 day'
        ELSE NULL
    END AS cerrado_en,
    p.titulo,
    p.codigo,
    COALESCE(
        CASE WHEN p.estado = 'CLOSED' THEN p.creado_en_val + p.sla_duracion_val + (random() * 2 + 1) * INTERVAL '1 day' END,
        CASE WHEN p.estado IN ('RESOLVED', 'CLOSED') THEN p.creado_en_val + p.sla_duracion_val * 0.6 END,
        p.creado_en_val + INTERVAL '1 hour'
    ) AS actualizado_en
FROM (
    SELECT
        f.*,
        'DEMO-' || lpad(f.n::text, 4, '0') AS codigo,
        'Ticket de demostración ' || f.n || ' - ' || f.categoria AS titulo,
        'Descripción automática de prueba para el ticket ' || f.n || ' en categoría ' || f.categoria AS descripcion
    FROM fechas_calc f
) p
WHERE NOT EXISTS (
    SELECT 1 FROM tickets t WHERE t.codigo = p.codigo
);