-- Recalcula los tickets activos de demo al momento de ejecutar la migración.
-- El SLA documentado es: URGENT 4 h, HIGH 8 h, MEDIUM 24 h y LOW 72 h.
-- Los tickets MEDIUM/LOW cubren vencidos, por vencer (<= 12 h) y con más de
-- 12 h restantes. URGENT/HIGH solo pueden estar vencidos o por vencer, dado
-- que su SLA completo es menor o igual a la ventana de 12 h del dashboard.
WITH reloj AS (
    SELECT CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AS ahora_utc
),
demo_activos AS (
    SELECT
        t.id,
        t.prioridad,
        CASE t.prioridad
            WHEN 'URGENT' THEN 4
            WHEN 'HIGH' THEN 8
            WHEN 'MEDIUM' THEN 24
            WHEN 'LOW' THEN 72
        END AS sla_horas,
        ROW_NUMBER() OVER (
            PARTITION BY t.prioridad
            ORDER BY SUBSTRING(t.codigo FROM 6)::INTEGER
        ) AS posicion_prioridad
    FROM tickets t
    WHERE t.codigo LIKE 'DEMO-%'
      AND t.estado IN (
          'SUBMITTED', 'CATEGORIZED', 'PRIORITIZED', 'ASSIGNED',
          'PENDING_APPROVAL', 'APPROVED', 'IN_PROGRESS'
      )
),
clasificados AS (
    SELECT
        d.*,
        CASE
            WHEN d.prioridad IN ('MEDIUM', 'LOW')
                THEN MOD(d.posicion_prioridad - 1, 3)
            ELSE MOD(d.posicion_prioridad - 1, 2)
        END AS grupo_sla
    FROM demo_activos d
),
vencimientos AS (
    SELECT
        c.id,
        c.sla_horas,
        r.ahora_utc,
        CASE c.grupo_sla
            -- SLA vencido entre 1 y 6 horas.
            WHEN 0 THEN r.ahora_utc
                - ((MOD(c.posicion_prioridad, 6) + 1) * INTERVAL '1 hour')
            -- SLA futuro dentro de la ventana documentada de 12 horas.
            WHEN 1 THEN r.ahora_utc
                + ((MOD(c.posicion_prioridad - 1, LEAST(c.sla_horas, 12)) + 1) * INTERVAL '1 hour')
            -- Solo MEDIUM/LOW llegan aquí: quedan entre 13 horas y su SLA máximo.
            ELSE r.ahora_utc
                + ((13 + MOD(c.posicion_prioridad * 7, c.sla_horas - 12)) * INTERVAL '1 hour')
        END AS sla_due_at
    FROM clasificados c
    CROSS JOIN reloj r
)
UPDATE tickets t
SET creado_en = v.sla_due_at - (v.sla_horas * INTERVAL '1 hour'),
    sla_due_at = v.sla_due_at,
    actualizado_en = v.ahora_utc
FROM vencimientos v
WHERE t.id = v.id;
