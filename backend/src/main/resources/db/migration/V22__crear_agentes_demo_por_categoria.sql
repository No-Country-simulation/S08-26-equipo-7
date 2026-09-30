-- Crea dos agentes de demostración por cada categoría activa.
-- Reutiliza la credencial del agente demo documentado y el código de categoría
-- como área para que coincida con la asignación de tickets.
WITH rol_agente AS (
    SELECT id
    FROM roles
    WHERE nombre = 'AGENT'
),
credencial_agente AS (
    SELECT password_hash
    FROM usuarios
    WHERE email = 'agente@serviceflow.com'
)
INSERT INTO usuarios (nombre, email, password_hash, rol_id, area)
SELECT
    'Agente ' || c.code || ' ' || LPAD(numero::TEXT, 2, '0'),
    'agente.' || LOWER(c.code) || '.' || LPAD(numero::TEXT, 2, '0') || '@serviceflow.com',
    credencial.password_hash,
    rol.id,
    c.code
FROM categorias c
CROSS JOIN GENERATE_SERIES(1, 2) AS agentes(numero)
CROSS JOIN rol_agente rol
CROSS JOIN credencial_agente credencial
WHERE c.active = TRUE
ON CONFLICT (email) DO NOTHING;
